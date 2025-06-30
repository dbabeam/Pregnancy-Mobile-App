import type React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

interface BackButtonProps {
  color?: string
}

const BackButton: React.FC<BackButtonProps> = ({ color = "white" }) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={28} color={color} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
  },
})

export default BackButton
