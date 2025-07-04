import { db } from '@/src/firebase';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";



export default function ListaConatos () {
    type Contato = {
      id: string;
      nome: string;
      telefone: string;
      email: string;
    };

    const [contatos, setContatos] = useState<Contato[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectContact, setSelectContact] = useState<Contato | null>(null);


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

  const openModal = (contato: Contato) => {
    setSelectContact(contato);
    setModalVisible(true);
  };

  const  closeModal = () => {
    setModalVisible(false);
    setSelectContact(null);
  }

  const deleteContato = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'agenda', id));

      setContatos(prev => prev.filter(contato => contato.id !== id));
      console.log('Contato deletado com sucesso!');
    } catch  (error) {
      console.error('Erro ao deletar contato', error);
    }
  };


  return (
    <View style={[styles.container, {backgroundColor: black}]}>
      <Text style={[styles.titulo, {color: textColor}]}>Agenda Compartilhada</Text>
      
      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={[
          styles.item,
          {
            backgroundColor: itemBackground,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        ]}>    
          <View>      
              <Text style={[styles.nome, {color: textColor}]}>{item.nome}</Text>
              <Text style={{color: textColor}}>{item.telefone}</Text>
            </View>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Feather name='eye' size={24} color={textColor} />
              </TouchableOpacity>
          </View>
        )}
      />    

      <TouchableOpacity 
        style={styles.customButton}
        onPress={() => router.push('/cadastro')}
      >
        <Text  style={styles.buttonText}>+</Text>
      </TouchableOpacity>
   

      <Modal
          visible={modalVisible}
          transparent={true}
          animationType='slide'
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable 
            style={[styles.modalContent, {backgroundColor: itemBackground}]}
            onPress={(e) => e.stopPropagation()}
          >

            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Feather name="x" size={24} color="white" />
            </Pressable>
        
          
            <Text style={[styles.modalTitle, {color: textColor}]}>Detalhes do Contato</Text>
            {selectContact && (
              <>
                <Text style={{color: textColor}}>Nome: {selectContact.nome}</Text>
                <Text style={{color: textColor}}>Telefone: {selectContact.telefone}</Text>
                <Text style={{color: textColor}}>E-mail: {selectContact.email}</Text>
              </>
            )}


            <TouchableOpacity 
              style={styles.trash} 
              onPress={() => {
                if (selectContact) {
                  deleteContato(selectContact.id);
                  closeModal();
                }
              }}
            >
              <Feather name='trash-2' size={34} color={'orange'} />
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,

  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 2,
    backgroundColor: 'red',
    borderRadius: 8, 
    alignItems: 'center'
  },
  trash: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20.
  },

});
