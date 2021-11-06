import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from 'react-native'
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import CalcButton from '../constants/CalcButton';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { auth, db } from '../services/firebase';


export default function WithDrawCrypto(props) {

    const {coinName,totalVolume, currentPrice} = props.route.params

    

    
    
    const [darkMode, setDarkMode] = useState(true);
    const [currentNumber, setCurrentNumber] = useState('0');
    const [totalOwnedCrypto, setTotalOwnedCrypto] = useState(0)
    const [docId, setDocId] = useState('')
    const [totalCredit, setTotalCredit] = useState(0)
    const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'DEL', ];


    useEffect(() => {
      async function main(){
        await db.collection("users")
                .doc(auth.currentUser.uid)
                .get()
                .then((doc) => {
                    setTotalCredit(doc.data().totalCredit)
                })

      }

      main()
      

    }, [])

    useEffect(() => {
        db.collection("CryptoPortfolio")
            .doc(auth.currentUser.uid)
            .collection("portfoilio")
            .where("cryptoId", "==", coinName)
            .get()
            .then((snap) => {
                snap.forEach((doc) => {
                    setDocId(doc.id)
                    setTotalOwnedCrypto(doc.data().qunaity)
                })
            })

    }, [])

    function sellCrypto(){
        if (parseInt(currentNumber) <= totalOwnedCrypto){
          if (totalOwnedCrypto != parseInt(currentNumber)){
            db.collection("CryptoPortfolio")
            .doc(auth.currentUser.uid)
            .collection("portfoilio")
            .doc(docId)
            .update({
                qunaity: totalOwnedCrypto - parseInt(currentNumber)
            })

          }
          else {
            db.collection("CryptoPortfolio")
            .doc(auth.currentUser.uid)
            .collection("portfoilio")
            .doc(docId)
            .delete()

          }
            

            db.collection("users")
                  .doc(auth.currentUser.uid)
                  .update({
                    totalCredit: totalCredit + parseInt(currentNumber) * currentPrice
                  })

            alert(`Successfuly sold. Cashed out for $ ${Math.round(100 * currentPrice * parseInt(currentNumber ? currentNumber : "0"))/100}`)

        }
        else {
            alert(`Transaction failed. You do not own this amount of ${coinName} to sell`)
        }

        
       

    }
    
  
    function handleInput(btnPressed){
      if (btnPressed === '+' || btnPressed === '-' || btnPressed === '*' || btnPressed === '/') {
        setCurrentNumber(currentNumber + btnPressed);
        return;
      }
  
      switch (btnPressed) {
        case 'DEL':
          setCurrentNumber(currentNumber.substring(0, (currentNumber.length - 1)))
          return
        
      }
      setCurrentNumber(currentNumber + btnPressed);
    }
  
  
    return (
        <>
      <View>
        <View style={styles.results}>

          <Text style={styles.infoText1}>{coinName} Current Price: ${Math.round(100 * currentPrice)/100} CAD</Text>
          <Text style={styles.infoText2}>Avalible coins: {totalVolume}</Text>
          <Text style={styles.infoText3}>Avalible credit: {auth.currentUser.totalCredit}</Text>
          <Text style={styles.infoText3}>Total holdings: {totalOwnedCrypto}</Text>
          <Text style={styles.infoText4}>Total Cashed out:   ${ Math.round(100 * currentPrice * parseInt(currentNumber ? currentNumber : "0"))/100} CAD</Text>



          
          <Text style={styles.resultText}>{currentNumber}</Text>
        </View>
        <View style={styles.buttons}>
          {buttons.map((btn) =>
            btn === '=' || btn === '/' || btn === '*' || btn === '-' || btn === '+' ?
              <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: '#FF6666' }]} onPress={() => handleInput(btn)}>
                <Text style={[styles.textButton, { color: 'white', fontSize: 28 }]}>{btn}</Text>
              </TouchableOpacity>
              : btn === 0 ?
                <TouchableOpacity key={btn} style={[styles.button, {
                  backgroundColor: typeof (btn) === 'number' ?
                    darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '36%'
                }]} onPress={() => handleInput(btn)}>
                  <Text style={styles.textButton}>{btn}</Text>
                </TouchableOpacity>
                : btn === '.' || btn === 'DEL' ?
                  <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: btn === '.' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '37%' }]}
                    onPress={() => handleInput(btn)}
                  >
                    <Text style={styles.textButton}>{btn}</Text>
                  </TouchableOpacity>
                  : btn === 'C' ?
                    <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: typeof (btn) === 'number' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '36%' }]}
                      onPress={() => handleInput(btn)}
                    >
                      <Text style={styles.textButton}>{btn}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: typeof (btn) === 'number' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed' }]}
                      onPress={() => handleInput(btn)}
                    >
                      <Text style={styles.textButton}>{btn}</Text>
                    </TouchableOpacity>
  
          )}
        </View>
      </View>
      <View style={{marginTop: 70}}>
      <Button color="#0000FF"    title="Sell Crypto"  onPress={sellCrypto} style={{backgroundColor: "#000000"}}></Button>
    </View>
    </>
    )
  
}

const styles = StyleSheet.create({
    results: {
        backgroundColor: '#282f3b',
        maxWidth: '100%',
        minHeight: '50%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    resultText: {
        maxHeight: 45,
        color: '#FF6666',
        margin: 15,
        fontSize: 35,
    },
    historyText: {
        color: '#B5B7BB',
        fontSize: 20,
        marginRight: 10,
        alignSelf: 'flex-end',
    },
    themeButton: {
        alignSelf: 'flex-start',
        bottom: '5%',
        margin: 15,
        backgroundColor: '#7b8084' ,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    buttons: {
        width: '100%',
        height: '30%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        borderColor: '#3f4d5b' ,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '24%',
        minHeight: '54%',
        flex: 2,
    },
    textButton: {
        color:  '#b5b7bb',
        fontSize: 28,
    },
    infoText1: {
      color: "#535DF2",
      fontSize: 18,
      marginRight: 140,
      marginBottom: 13

  },
  infoText2: {
    color: "#535DF2",
    fontSize: 18,
    marginRight: 140,
    marginBottom: 12

},
infoText3: {
  color: "#535DF2",
  fontSize: 18,
  marginRight: 140,
  marginBottom: 11

},
infoText4: {
color: "#535DF2",
fontSize: 18,
marginRight: 140,
marginBottom: 10

},
})
