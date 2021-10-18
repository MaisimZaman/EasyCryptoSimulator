import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView} from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import {auth} from '../../services/firebase'


export default function LoginScreen({ navigation }){

    const [email, setEmail]  = useState("");
    const [password, setPassword ] = useState("");

 
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser){
                navigation.replace("MainLayout"); 

            }

        });

        return unsubscribe;
        
    }, [])
    

    function signIn(){
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error))

        //console.log("This is a corrrect sign in")
        
    }
    
    
    return (
        <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <Image
                source={
                    require("../../assets/mylogo.png")
                }

                style={{width: 200, height: 200}}
            ></Image>

            <View style={styles.inputContainer}>
                <Input 
                style={{color: "white"}}
                placeholder="Email" 
                autoFocus 
                placeholderTextColor="white"
                type="Email" 
                value={email} 
                onChangeText={(text) => setEmail(text)} />
                <Input 
                placeholder="Passowrd"  
                placeholderTextColor="white"
                style={{color: "white"}}
                secureTextEntry   
                type="password" 
                value={password}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={signIn}
                />
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title="Login"></Button>
            <Button containerStyle={styles.button} onPress={() => navigation.navigate("RegisterScreen")} type="outline" title="Register"></Button>
            
        </KeyboardAvoidingView>
    )
    
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "black",


    },
    inputContainer: {
        width: 300,
        color: "white",


    },
    button: {
        width: 200,
        marginTop: 10,

    },


})

