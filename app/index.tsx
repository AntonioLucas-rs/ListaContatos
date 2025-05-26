import { db } from '@/src/firebase';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";


export default function ListaConatos () {
    type Contato = {
      id: string;
      nome: string;
      telefone: string;
      email: string;
    };

    const [contatos, setContatos] = useState<Contato[]>([]);
    const router = useRouter();
    const colorSheme = useColorScheme();
    const textColor = colorSheme === 'dark' ? 'white' : 'black';
    const black = colorSheme === 'dark' ? 'black' : 'white';
    const itemBackground = colorSheme === 'dark' ? '#333' : '#ddd';

    useFocusEffect(
      useCallback(() => {
      async function fetchContatos() {
        try {
          const querySnapshot = await getDocs(collection(db, 'agenda'));
          const lista = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Contato, 'id'>)
          }));
          setContatos(lista);
        } catch (errror) {
          console.error('Erro ao buscar Contatos', errror);
        }
      }
      fetchContatos();
    }, [])
  );


    return (
        <View style={[styles.container, {backgroundColor: black}]}>
            <Text style={[styles.titulo, {color: textColor}]}>Agenda Compartilhada</Text>
            <FlatList
                data={contatos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.item, {backgroundColor: itemBackground}]}>
                        <Text style={[styles.nome, {color: textColor}]}>{item.nome}</Text>
                        <Text style={{color: textColor}}>{item.telefone}</Text>
                    </TouchableOpacity>
                )}
            />    

            <TouchableOpacity 
                style={styles.customButton}
                onPress={() => router.push('/cadastro')}
            >
                <Text  style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
        fontSize: 32,
        textAlign: 'center',
        paddingVertical: 40,
    },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  customButton: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
