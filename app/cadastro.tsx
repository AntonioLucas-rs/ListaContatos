import BotaoLaranja from "@/components/botaoLaranja";
import { db } from '@/src/firebase';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";


export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    const colorScheme = useColorScheme();
    const background = colorScheme === 'dark' ? 'black' : 'white';
    const textColor = colorScheme === 'dark' ? 'white' : 'black';
    const inputBackground = colorScheme === 'dark' ? '#333' : '#eee';

    const handleSubmit = async () => {    
        if (!nome || !telefone){
            Alert.alert('Erro', 'Por favor, preencha os campos.');
            return;
        }
        try {
            await addDoc(collection(db, 'agenda'), {
                nome,
                telefone, 
                email
            });
            Alert.alert('Sucesso', 'Contato cadastrado com sucesso!');
            setNome('');
            setTelefone('');
            setEmail('');
        } catch  (error)  {
            console.error('Erro ao add Contato:', error);
            Alert.alert('Erro', 'Não foi possivel cadatrar contato')
        }
    }

    const router = useRouter();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            

        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: background}]}>
            <TouchableOpacity 
                style={styles.buttonBack}
                onPress={() => router.back()}
            >
                <AntDesign name="leftcircleo" size={54} color="orange" />
            </TouchableOpacity>

            <Text style={[styles.titulo, {color: textColor}]}>Tela de Cadastro</Text>
            <Text style={[styles.label, {color: textColor}]}>Nome:</Text>
            <TextInput
                style={[styles.input, {backgroundColor: inputBackground, color: textColor}]}
                placeholder="Digite seu nome"
                placeholderTextColor='#999'
                value={nome}
                onChangeText={setNome}
            />

            <Text style={[styles.label, {color: textColor}]}>N° de WhastsApp:</Text>
            <TextInput
                style={[styles.input, {backgroundColor: inputBackground, color: textColor}]}
                placeholder="Digite seu WhatsApp"
                placeholderTextColor='#999'
                value={telefone}
                onChangeText={setTelefone}
            />

            <Text style={[styles.label, {color: textColor}]}>E-mail:</Text>
            <TextInput
                style={[styles.input, {backgroundColor: inputBackground, color: textColor}]}
                placeholder="Digite seu e-mail"
                placeholderTextColor='#999'
                value={email}
                onChangeText={setEmail}
            />
            
            <BotaoLaranja title='Cadastrar' onPress={handleSubmit} />
        </ScrollView>
        
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 32,
        textAlign: 'center',
        paddingVertical: 40,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    buttonBack: {
        position: 'absolute',
        top: 160,
        left: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
