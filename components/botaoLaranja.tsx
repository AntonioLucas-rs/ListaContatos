import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";

type BotaoLaranjaProps = {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
};


export default  function BotaoLaranja({ onPress, title}: BotaoLaranjaProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.botao,
                pressed && styles.botaoPressionado
            ]}
            onPress={onPress}
        >
            <Text style={styles.botaoTexto}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoPressionado: {
    opacity: 0.7,  // efeito de "apertado"
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});