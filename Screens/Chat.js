import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fonts, layout, colors } from "../Styles/styles";
import firebase from "../Config";
import * as Location from "expo-location";

const database = firebase.database();
const ref_lesdiscussions = database.ref("lesdiscussions");
const ref_currentistyping = database.ref("isTyping");

export default function Chat(props) {
  const currentUser = props.route.params.currentUser;
  const secondUser = props.route.params.secondUser;

  const iddisc =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;
  const ref_unediscussion = ref_lesdiscussions.child(iddisc);

  const [Msg, setMsg] = useState("");
  const [data, setdata] = useState([]);
  const [secondUserTyping, setSecondUserTyping] = useState(false);

  const ref_currentUserTyping =
ref_currentistyping.child(currentUser.id + "_isTyping");
  const ref_secondUserTyping = ref_currentistyping.child(secondUser.id
+ "_isTyping");

  // Récupérer les messages
  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((unmessage) => {
        d.push(unmessage.val());
      });
      setdata(d);
    });

    return () => {
      ref_unediscussion.off();
    };
  }, []);

  // Surveiller l'état `isTyping` de l'autre utilisateur
  useEffect(() => {
    ref_secondUserTyping.on("value", (snapshot) => {
      setSecondUserTyping(snapshot.val() || false);
    });

    return () => {
      ref_secondUserTyping.off();
    };
  }, []);

  const handleSend = () => {
    if (Msg.trim() === "") return;

    const key = ref_unediscussion.push().key;
    const ref_unmsg = ref_unediscussion.child(key);
    ref_unmsg.set({
      body: Msg,
      time: new Date().toLocaleString(),
      sender: currentUser.id,
      receiver: secondUser.id,
    });

    // Réinitialiser l'état après envoi
    setMsg("");
    ref_currentUserTyping.set(false);
  };

  const handleTyping = (text) => {
    setMsg(text);

    if (text.trim() !== "") {
      ref_currentUserTyping.set(true);
    } else {
      ref_currentUserTyping.set(false);
    }
  };

  const sendLocation = async () => {
    try {
      // Demande de permission pour accéder à la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Obtenir la localisation actuelle
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Envoyer la localisation comme un message
      const key = ref_unediscussion.push().key;
      const ref_unmsg = ref_unediscussion.child(key);
      ref_unmsg.set({
        body: `Location:
https://www.google.com/maps?q=${latitude},${longitude}`,
        time: new Date().toLocaleString(),
        sender: currentUser.id,
        receiver: secondUser.id,
      });

      alert("Location sent successfully!");
    } catch (error) {
      console.error("Error sending location: ", error);
      alert("Failed to send location");
    }
  };


  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.container}
      >
        <Text style={styles.headerText}>
          Chat {currentUser.nom} {secondUser.nom}
        </Text>

        <FlatList
          style={styles.messagesContainer}
          data={data}
          renderItem={({ item, index }) => {
            const isCurrentUser = item.sender === currentUser.id;
            const color = isCurrentUser ? "#FFF" : "#444"; // Fond sombre
            const textColor = isCurrentUser ? colors.buttonColor :
"#fff"; // Texte clair pour l'utilisateur courant

            const profileImage = isCurrentUser
              ? currentUser.uriImage
              : secondUser.uriImage;

            const showProfileImage =
              index === 0 || item.sender !== data[index - 1].sender;

            return (
              <View
                style={[
                  styles.messageContainer,
                  {
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  },
                ]}
              >
                {showProfileImage && profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImage} />
                )}
                <View style={[styles.message, { backgroundColor: color }]}>
                  <View style={styles.messageContent}>
                    <Text style={[styles.messageText, { color: textColor }]}>
                      {item.body}
                    </Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {secondUserTyping && (
          <Text style={{ color: "#fff", marginBottom: 5 }}>
            {secondUser.nom} is typing...
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleTyping}
            value={Msg}
            placeholderTextColor="#ccc"
            placeholder="Write a message"
            style={styles.textinput}
            onFocus={() => ref_currentUserTyping.set(true)}
            onBlur={() => ref_currentUserTyping.set(false)}
          />
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#555"
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableHighlight>

          <TouchableHighlight
  activeOpacity={0.5}
  underlayColor="#555"
  style={styles.sendButton}
  onPress={sendLocation}
>
  <Image
    source={require("../assets/output-onlinepngtools.png")}
    style={styles.locationIcon}

  />
</TouchableHighlight>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  locationIcon: {
    width: 20,  // Largeur réduite
    height: 20, // Hauteur réduite
    resizeMode: "contain", // Pour s'assurer que l'image garde ses proportions
    tintColor: "#fff",
    resizeMode: "contain",
  },
  headerText: {
    marginTop: 50,
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  messagesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "95%",
    borderRadius: 10,
    marginVertical: 20,
    padding: 5,
    paddingTop: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginVertical: 0,
    borderRadius: 8,
    maxWidth: "80%",
  },
  messageContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  textinput: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    height: 50,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.buttonColor,
    borderRadius: 10,
    height: 50,
    width: "20%",
    marginRight:5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
