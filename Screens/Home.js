import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native"; // Pour naviguer programmatiquement
import Group from "./Home/Group";
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";
import { colors } from "../Styles/styles"; // Assurez-vous d'importer la couleur des boutons
import { MaterialCommunityIcons } from "react-native-vector-icons"; // Importer les icônes
import { Alert } from "react-native"; // Pour demander confirmation avant la déconnexion

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentId = props.route.params.currentId;
  const navigation = useNavigation(); // Hook pour naviguer

  // Fonction de déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion", // Titre de l'alerte
      "Êtes-vous sûr de vouloir vous déconnecter ?", // Message
      [
        {
          text: "Annuler", // Bouton pour annuler
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: () => {
            // Action pour rediriger vers la page d'authentification
            navigation.replace("Authentification");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: colors.buttonColor, // Couleur des boutons
        shadowColor: "#000", // Ombre noire
        shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre
        shadowOpacity: 0.2, // Transparence de l'ombre
        shadowRadius: 4, // Rayonnement de l'ombre
        elevation: 5, // Ombre sur Android
      }}
    >
      <Tab.Screen
        name="ListProfil"
        component={ListProfil}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "Profils", // Label de l'onglet
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple" // Icône représentant plusieurs comptes
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        options={{
          tabBarLabel: "Groupes", // Label de l'onglet
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group" // Icône représentant un groupe d'utilisateurs
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "Mon Profil", // Label de l'onglet
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account" // Icône représentant un utilisateur
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null} // Pas de composant spécifique
        listeners={{
          tabPress: handleLogout, // Appeler handleLogout lors de l'appui
        }}
        options={{
          tabBarLabel: "Déconnexion", // Label de l'onglet
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="logout" // Icône pour la déconnexion
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
