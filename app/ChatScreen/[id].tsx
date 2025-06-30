import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hi there!" },
    { id: 2, sender: "me", text: "Hello! How are you?" },
    { id: 3, sender: "other", text: "Doing well, thanks!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: input,
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat #{id}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B83280",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#FDC5F5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    backgroundColor: "#E6E6E6",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#B83280",
    padding: 10,
    borderRadius: 50,
  },
});
