import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    Platform,
    Animated,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';

import { connect } from "react-redux";
import { getHoldings, getCoinMarket } from "../stores/market/marketActions";
import { useFocusEffect } from "@react-navigation/native";

import { MainLayout } from "./";
import { BalanceInfo, IconTextButton, Chart } from "../components";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { isIphoneX } from 'react-native-iphone-x-helper';

import { auth, db } from '../services/firebase';

const Home = ({ getHoldings, getCoinMarket, myHoldings, coins, navigation }) => {

    const [selectedCoin, setSelectedCoin] = React.useState(null)
    

    const [purchaseQuaintiy, setPurchaseQuainity] = React.useState(0)

    const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;

    const [newHoldings, setHoldings] = useState([])

    const [isSelectedInHolding, setSelectedInHolding] = useState(false)

    React.useEffect(() => {
        const unsubscribe = db.collection('CryptoPortfolio')
                            .doc(auth.currentUser.uid).collection('portfoilio')
                            .onSnapshot((snapshot) => setHoldings(snapshot.docs.map(doc => ({
                                id: doc.data().cryptoId,
                                qty: doc.data().qunaity
                            }))))


        return unsubscribe;
    }, [navigation])

    React.useEffect(() => {
        if (selectedCoin != null){

            const findMatch = newHoldings.filter(function(value) {
                    return value.id == selectedCoin.id; });




            if (findMatch.length > 0){
                
                setSelectedInHolding(true)

            }
            else {
                setSelectedInHolding(false)
            }


        }
        else {
            setSelectedInHolding(false)
        }

    }, [selectedCoin, isSelectedInHolding])

    //React.useEffect(() => {
    //    console.log(selectedCoin.id)
    //    console.log(selectedCoin.total_volume)
    //    console.log(selectedCoin.sparkline_in_7d.price[selectedCoin.sparkline_in_7d.price.length - 1])
    //}, [selectedCoin])

    

    

    useFocusEffect(
        React.useCallback(() => {
            //console.log("Thesse are the holdings")
            //console.log(newHoldings)
            getHoldings(newHoldings)
            getCoinMarket()
        }, [])
    )

    //let totalWallet = Math.round(100 * myHoldings.reduce((a, b) => a + (b.total || 0), 0)/100)
    let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0)
    let valueChange = myHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0)
    let percChange = valueChange / (totalWallet - valueChange) * 100

    

    function renderWalletInfoSection() {
        
        function renderWithdrawButton(){
            if (isSelectedInHolding){
                return (
                    <IconTextButton
                        label="Withdraw"
                        icon={icons.withdraw}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                        }}
                        onPress={() => navigation.navigate("WithDrawCrypto", {
                            coinName: selectedCoin.id,
                            totalVolume: selectedCoin.total_volume,
                            currentPrice: selectedCoin.sparkline_in_7d.price[selectedCoin.sparkline_in_7d.price.length - 1]


                        })}
                    />
                )
            }
        }

        return (
            <View
                style={{
                    paddingHorizontal: SIZES.padding,
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25,
                    backgroundColor: COLORS.gray
                }}
            >
                {/* Balance Info */}
                <BalanceInfo
                    title="Your Wallet"
                    displayAmount={totalWallet}
                    changePct={percChange}
                    containerStyle={{
                        marginTop: isIphoneX() ? 50 : 20
                    }}
                />

                {/* Buttons */}
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 30,
                        marginBottom: -15,
                        paddingHorizontal: SIZES.radius
                    }}
                >
                    <IconTextButton
                        label="Transfer"
                        icon={icons.send}
                        
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius
                        }}
                        onPress={() => {navigation.navigate("BuyCrypto", {
                            coinName: selectedCoin.id,
                            totalVolume: selectedCoin.total_volume,
                            currentPrice: selectedCoin.sparkline_in_7d.price[selectedCoin.sparkline_in_7d.price.length - 1]


                        }); }}
                    />

                    {renderWithdrawButton()}
                </View>
            </View>
        )
    }

    function renderBuyModal(){
        return (
            
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: modalY,
                        width: "100%",
                        padding: SIZES.padding,
                        backgroundColor: COLORS.primary
                    }}
                >
                    <TextInput 
                    style={{color: "white"}}
                    keyboardType = 'numeric'
                    onChangeText = { (num)=> setPurchaseQuainity(num)}
                    value = {purchaseQuaintiy}
                /> 
                    
                </Animated.View>
            
        )
    }

    return (
        <MainLayout>
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLORS.black
                }}
            >
                {/* Header - Wallet Info */}
                {renderWalletInfoSection()}

                {/* Chart */}
                <Chart
                    containerStyle={{
                        marginTop: SIZES.padding * 2,
                    }}
                    chartPrices={selectedCoin ? selectedCoin?.sparkline_in_7d?.price : coins[0]?.sparkline_in_7d?.price}
                />

                {/* Top Cryptocurrency */}
                <FlatList
                    data={coins}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        marginTop: 30,
                        paddingHorizontal: SIZES.padding
                    }}
                    ListHeaderComponent={
                        <View style={{ marginBottom: SIZES.radius }}>
                            <Text style={{ color: COLORS.white, ...FONTS.h3, fontSize: 18 }}>Top Cryptocurrency</Text>
                        </View>
                    }
                    renderItem={({ item }) => {

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
                    }}
                    ListFooterComponent={
                        <View
                            style={{
                                marginBottom: 50
                            }}
                        />
                    }
                />
            </View>
        </MainLayout>
    )
}

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        coins: state.marketReducer.coins
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => { return dispatch(getHoldings(holdings, currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page)) },
        getCoinMarket: (currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => { return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);