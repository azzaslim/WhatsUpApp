
import React from "react";
import { useState, useEffect} from "react";
import { StyleSheet } from "react-native";

import { colors } from "../../Styles/styles";
import firebase from "firebase/compat/app";


const database = firebase.database();
const ref_groupChat = database.ref("groupChat");

export default function GroupChat(props) {
  const currentUser = props.route.params.currentUser;

  const [Msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [isTypingUsers, setIsTypingUsers] = useState([]);

  // Reference to typing state for the current user
  const ref_currentUserTyping = database.ref("isTypingGroup")
    .child(currentUser.id);

  // Fetch group chat messages
  useEffect(() => {
    ref_groupChat.on("value", (snapshot) => {
      let messages = [];
      snapshot.forEach((message) => {
        messages.push(message.val());
      });
      setData(messages);
    });

    return () => {
      ref_groupChat.off();
    };
  }, []);

  // Fetch users typing state
  useEffect(() => {
    const ref_typingState = database.ref("isTypingGroup");

    ref_typingState.on("value", (snapshot) => {
      const typingUsers = [];
      snapshot.forEach((user) => {
        if (user.val() && user.key !== currentUser.id) {
          typingUsers.push(user.key);
        }
      });
      setIsTypingUsers(typingUsers);
    });

    return () => {
      ref_typingState.off();
    };
  }, []);

  // Send message to the group
  const handleSend = () => {
    if (Msg.trim() === "") return;

    const key = ref_groupChat.push().key;
    ref_groupChat.child(key).set({
      body: Msg,
      time: new Date().toLocaleString(),
      sender: currentUser.id,
      senderName: currentUser.nom,
      senderImage: currentUser.uriImage || null,
    });

    setMsg("");
    ref_currentUserTyping.set(false);
  };

  // Handle typing state
  const handleTyping = (text) => {
    setMsg(text);
    if (text.trim() !== "") {
      ref_currentUserTyping.set(true);
    } else {
      ref_currentUserTyping.set(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../../assets/background.png")}
        style={styles.container}
      >
        <Text style={styles.headerText}>Group Chat</Text>

        <FlatList
          style={styles.messagesContainer}
          data={data}
          renderItem={({ item }) => {
            const isCurrentUser = item.sender === currentUser.id;

            return (
              <View
                style={[
                  styles.messageContainer,
                  {
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  },
                ]}
              >
                {item.senderImage && (
                  <Image
                    source={{ uri: item.senderImage }}
                    style={styles.profileImage}
                  />
                )}
                <View
                  style={[
                    styles.message,
                    { backgroundColor: isCurrentUser ? "#FFF" : "#444" },
                  ]}
                >
                  <Text
                    style={{
                      color: isCurrentUser ? colors.buttonColor : "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {item.senderName}
                  </Text>
                  <Text style={styles.messageText}>{item.body}</Text>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
              </View>
            );
          }}
        />

        {isTypingUsers.length > 0 && (
          <Text style={styles.typingText}>
            {isTypingUsers.join(", ")} is typing...
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleTyping}
            value={Msg}
            placeholderTextColor="#ccc"
            placeholder="Write a message"
            style={styles.textInput}
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
  textInput: {
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
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  typingText: {
    color: "#fff",
    marginBottom: 5,
  },
});

