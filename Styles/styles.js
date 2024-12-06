import { StyleSheet } from "react-native";

export const colors = {
  //primaryBackground: "#0005",
  textColor: "white",
  inputBackground: "white",
  buttonColor: "pink",
  
};

export const fonts = {
  title: {
    
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textColor,
    color:"pink",
    
  },
  input: {
    fontSize: 16,
    padding: 10,
    height: 50,
    width: "90%",
    borderRadius: 2.5,
    textAlign: "center",
    backgroundColor: colors.inputBackground,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    width:100,
    
  },
};

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  innerContainer: {
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
    width: "85%",
    alignItems: "center",
    padding: 20, // Padding inside the box
    marginVertical: 20, 
  },
  button: {
    backgroundColor: "pink", 
    paddingVertical: 14,  
    paddingHorizontal: 29, 
    borderRadius: 10, 
    alignItems: "center",
    justifyContent: "center",
    width: "42.5%",
  },
});