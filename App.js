import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { evaluate } from 'mathjs';
import moment from 'moment-timezone'; // Import moment-timezone for timezone and time support

export default function App() {
  const [displayValue, setDisplayValue] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Update date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(moment().format('YYYY-MM-DD  HH:mm:ss')); // Format includes both date and time
    }, 1000);
    


    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleTap = (value) => {
    switch (value) {
      case 'AC': // All Clear button
        setDisplayValue('');
        break;
      case 'C': // Clear last entry
        setDisplayValue(displayValue.slice(0, -1));
        break;
      case '=':
        try {
          // Ensure that the expression is correctly formatted for evaluation
          setDisplayValue(evaluate(formatExpression(displayValue)).toString());
        } catch (e) {
          setDisplayValue('Error');
        }
        break;
      case '⌫': // Backspace button
        setDisplayValue(displayValue.slice(0, -1));
        break;
      case '√':
        setDisplayValue(displayValue + 'sqrt(');
        break;
      case 'sin':
        setDisplayValue(displayValue + 'sin(');
        break;
      case 'cos':
        setDisplayValue(displayValue + 'cos(');
        break;
      case 'tan':
        setDisplayValue(displayValue + 'tan(');
        break;
      case 'ln':
        setDisplayValue(displayValue + 'ln(');
        break;
      case 'log':
        setDisplayValue(displayValue + 'log(');
        break;
      case ')':
        // Automatically add closing parenthesis if it was opened
        if (countOpenParentheses(displayValue) > countCloseParentheses(displayValue)) {
          setDisplayValue(displayValue + ')');
        }
        break;
      default:
        setDisplayValue(displayValue + value);
    }
  };

  // Count the number of open parentheses
  const countOpenParentheses = (expression) => (expression.match(/\(/g) || []).length;

  // Count the number of close parentheses
  const countCloseParentheses = (expression) => (expression.match(/\)/g) || []).length;

  // Format the expression to ensure correct syntax
  const formatExpression = (expression) => {
    let formatted = expression.replace(/√\(/g, 'sqrt(').replace(/\^/g, '**');
    const openCount = countOpenParentheses(formatted);
    const closeCount = countCloseParentheses(formatted);
    if (openCount > closeCount) {
      formatted += ')'.repeat(openCount - closeCount);
    }
    return formatted;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.displayContainer} horizontal={true}>
        <Text style={styles.display}>
          {displayValue || '0'}
        </Text>
      </ScrollView>
      <Text style={styles.dateTimeDisplay}>{currentDateTime}</Text>
      <View style={styles.buttonRow}>
        
        {renderButton('AC', 'functionButton')}
        {renderButton('C', 'functionButton')}
        {renderButton(')', 'functionButton')}
        {renderButton('⌫', 'functionButton')}
        
      </View>
      <View style={styles.buttonRow}>
        {renderButton('sin', 'functionButton')}
        {renderButton('Cos', 'functionButton')}
        {renderButton('tan', 'functionButton')}
        {renderButton('ln', 'functionButton')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('log','functionButton')}
        {renderButton('√','functionButton')}
        {renderButton('/','functionButton')}
        {renderButton('*','functionButton')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('1')}
        {renderButton('2')}
        {renderButton('3')}
        {renderButton('-','functionButton')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('4')}
        {renderButton('5')}
        {renderButton('6')}
        {renderButton('+','functionButton')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('7')}
        {renderButton('8')}
        {renderButton('9')}
        {renderButton('.','functionButton')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('0', 'zeroButton')}
        {renderButton('=','equalButton')}
      </View>
    </View>
  );

  function renderButton(label, buttonStyle) {
    return (
      <TouchableOpacity
        onPress={() => handleTap(label)}
        style={[
          styles.button,
          buttonStyle === 'zeroButton' && styles.zeroButton,
          buttonStyle === 'equalButton' && styles.equalButton,
          buttonStyle === 'functionButton' && styles.functionButton
        ]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

 
  container: {
    flex: 1,
    backgroundColor: '#06072A',
    justifyContent: 'center',
    padding: 10,
  },
  displayContainer: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
  },
  display: {
    color: 'white',
    fontSize: 36,
    flex: 1,
    margingleft:20,
    textAlign: 'right',
  },
  dateTimeDisplay: {
    color: '#f39c12',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 10,
    
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  button: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    margin: 5,
    borderRadius: 10,
  },
  zeroButton: {
    flex: 1,
  },
  equalButton: {
    flex: 1,
    height: 80,
    fontSize: 10,
    backgroundColor: '#f39c12',
  },
  functionButton: {
    backgroundColor: '#2c3e50',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});
