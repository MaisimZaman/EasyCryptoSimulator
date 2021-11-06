import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, KeyboardAvoidingView } from 'react-native'
import {auth, db } from '../services/firebase'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container} from 'native-base'


export default function () {


    function renderCryptoItem({item}){
        let priceColor = (item.price_change_percentage_7d_in_currency == 0) ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0) ? COLORS.lightGreen : COLORS.red

        return (
            <TouchableOpacity
                style={{
                    height: 55,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => setSelectedCoin(item)}
            >
                {/* Logo */}
                <View
                    style={{
                        width: 35
                    }}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            height: 20,
                            width: 20
                        }}
                    />
                </View>

                {/* Name */}
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>{item.name}</Text>
                </View>

                {/* Figures */}
                <View>
                    <Text style={{ textAlign: 'right', color: COLORS.white, ...FONTS.h4 }}>$ {item.current_price}</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >
                        {
                            item.price_change_percentage_7d_in_currency != 0 &&
                            <Image
                                source={icons.upArrow}
                                style={{
                                    height: 10,
                                    width: 10,
                                    tintColor: priceColor,
                                    transform: item.price_change_percentage_7d_in_currency > 0 ? [{ rotate: '45deg' }] : [{ rotate: '125deg' }]
                                }}
                            />
                        }

                        <Text style={{ marginLeft: 5, color: priceColor, ...FONTS.body5, lineHeight: 15 }}>{item.price_change_percentage_7d_in_currency.toFixed(2)}%</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    function renderMain(){

        if (search == ''){
            return (
                
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                       <Text>Search for cyrpto</Text>
                    </View>
                
            )
        }

        return (

            <FlatList
                numColumns={1}
                horizontal={false}
                data={}
                renderItem={({ item }) => (
                   renderPerson(item)

                )}
                onEndReached={endReached}
            />
        )
    }


    return (

        <Container>
            <ScrollView>
                <TextInput
                    style={styles.textInput}
                    placeholder="Seach for User..."
                    onChangeText={(search) => setSearch(search)} />

                {renderMain()}

            </ScrollView>
            
        </Container>
    )
}

const styles = StyleSheet.create({
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
})