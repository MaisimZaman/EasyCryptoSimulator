import React, {useState, useLayoutEffect} from 'react'
import { View,  StyleSheet, KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Text } from 'react-native-elements'
import {auth, db} from '../../services/firebase'


export default function RegisterScreen({ navigation }){

    const [name, setName] = useState('');
    
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');




    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Register your account"
        })
    }, [navigation])

    function register(){
        const defaultProfilePic = 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar-600x600.png'
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: defaultProfilePic,
                totalCredit: 100000,

            })

            

            db.collection("users")
                    .doc(auth.currentUser.uid)
                    .set({
                        displayName: name,
                        email: email,
                        photoURL: defaultProfilePic,
                        uid: auth.currentUser.uid,
                        totalCredit: 100000,
                    })
        })
        .catch((error) => alert(error.message));

        



    }



    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            
            <Text h3 style={{marginBottom: 50, color: "white"}}>
                Register your account
            </Text>

            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Full name"
                    placeholderTextColor="white"
                    style={{color: "white"}}
                    autoFocus
                    type='text'
                    value={name}
                    onChangeText={text => setName(text)}
                ></Input>

                <Input 
                    placeholder="Email"
                    placeholderTextColor="white"
                    style={{color: "white"}}
                    type='text'
                    value={email}
                    onChangeText={text => setEmail(text)}
                ></Input>

                <Input 
                    placeholder="Password"
                    placeholderTextColor="white"
                    style={{color: "white"}}
                    type='text'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    onSubmitEditing={register}
                ></Input>

                


            </View>

            <Button
                style={styles.button}
                raised
                title="Register"
                onPress={register}
                
            ></Button>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "black"
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 500,
        marginTop: 10,
    },


})
