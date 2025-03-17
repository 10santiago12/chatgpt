import { StyleSheet } from 'react-native';

export default StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#343541",
padding: 10,
},
header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingTop: 50,
padding: 20,
backgroundColor: "#343541",
},
fullScreenMenu: {
position: "absolute",
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: "#202020",
zIndex: 1,
justifyContent: "center",
alignItems: "center",
},
menuContent: {
width: "80%",
height: "80%",
justifyContent: "space-between",
},
chatList: {
flex: 1,
marginVertical: 10,
},
menuItem: {
padding: 15,
borderBottomWidth: 1,
borderBottomColor: "#555",
},
menuItemText: {
color: "#FFF",
fontSize: 16,
textAlign: "center",
},
newChatButton: {
padding: 15,
backgroundColor: "#18a47c",
borderRadius: 10,
alignItems: "center",
},
newChatButtonText: {
color: "#FFF",
fontSize: 16,
fontWeight: "bold",
},
logoutButton: {
padding: 5,
borderRadius: 10,
alignItems: "center",
},
logoutButtonText: {
color: "#ff4444",
fontSize: 16,
fontWeight: "bold",
},
chatContainer: {
flex: 1,
marginBottom: 10,
},
message: {
maxWidth: "80%",
padding: 10,
marginVertical: 5,
borderRadius: 10,
},
userMessage: {
alignSelf: "flex-end",
backgroundColor: "#18a47c",
},
aiMessage: {
alignSelf: "flex-start",
backgroundColor: "#5d5d67",
},
userText: {
color: "#FFF",
},
aiText: {
color: "#FFF",
},
loading: {
textAlign: "center",
color: "#FFFFFF",
marginVertical: 10,
},
inputContainer: {
flexDirection: "row",
alignItems: "center",
backgroundColor: "#222",
padding: 10,
borderRadius: 30,
marginBottom: 35,
},
input: {
flex: 1,
color: "#fff",
paddingHorizontal: 10,
paddingVertical: 10,
},
sendButton: {
backgroundColor: "#18a47c",
borderRadius: 20,
padding: 10,
marginLeft: 10,
},
closeButton: {
position: "absolute",
bottom: 20,
borderRadius: 20,
padding: 10,
zIndex: 2,
},

chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
},
chatItemText: {
    color: "#FFF",
    fontSize: 16,
},
chatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
},
deleteIcon: {
    padding: 5,
    color: "#FFF",
},
deleteButton: {
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
},
deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
},
});
