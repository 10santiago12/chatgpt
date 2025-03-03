import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { APIResponse } from '@/interfaces/Responses';

export default function Chat() {
  const [message, setMessage] = useState("Explain how AI works");
  const [response, setResponse] = useState(""); // To store the API response
  const [isLoading, setIsLoading] = useState(false);

  const getResponse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB3k152tRx7iO3LTeyts5oFzbIR3OBFawA",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: message }]
            }]
          })
        }
      );
      const data: APIResponse = await response.json();
      console.log({ data });
      setResponse(data?.candidates[0]?.content?.parts[0]?.text || "No response received"); // Update the response state
    } catch (error) {
      console.log("Error:", { error });
      setResponse("An error occurred while fetching the response."); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          marginBottom: 20,
        }}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={{ marginBottom: 10 }}>Your Message: {message}</Text>
            <Text>Response: {response}</Text>
          </>
        )}
      </ScrollView>

      <View>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
          onChangeText={setMessage}
          value={message}
          placeholder="Type your message here"
        />
        <Button
          title="Send"
          onPress={getResponse}
        />
      </View>
    </View>
  );
}