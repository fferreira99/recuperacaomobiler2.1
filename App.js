import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'; 
import axios from 'axios';

const App = () => {
  const [nomePais, setNomePais] = useState('');
  const [contagemMedalhas, setContagemMedalhas] = useState({});
  const [erro, setErro] = useState('');

  const buscarMedalhasPorPais = async () => {
    try {
      const resposta = await axios.get(`http://10.136.63.230:3000/olimpiadas?country=${nomePais}`);
      console.log(resposta.data);
      if (resposta.data && resposta.data.length > 0) {
        let medalhasPais = [];
        for (let i = 0; i < resposta.data.length; i++) {
          if (resposta.data[i].country.toLowerCase() === nomePais.toLowerCase()) {
            medalhasPais.push(resposta.data[i]);
          }
        }
        if (medalhasPais.length > 0) {
          const totalMedalhas = medalhasPais.reduce((acc, curr) => {
            acc.gold = (acc.gold || 0) + curr.gold;
            acc.silver = (acc.silver || 0) + curr.silver;
            acc.bronze = (acc.bronze || 0) + curr.bronze;
            return acc;
          }, {});
          setContagemMedalhas(totalMedalhas);
          setErro('');
        } else {
          setContagemMedalhas({});
          setErro('País não encontrado ou sem medalhas.');
        }
      } else {
        setContagemMedalhas({});
        setErro('País não encontrado ou sem medalhas.');
      }
    } catch (error) {
      console.error('Erro ao buscar medalhas:', error);
      setContagemMedalhas({});
      setErro('Erro ao buscar medalhas.');
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Digite o nome do país para ver suas medalhas olímpicas:</Text>
      <TextInput
        style={styles.entrada}
        placeholder="Nome do país. Ex: Brasil"
        value={nomePais}
        onChangeText={text => setNomePais(text)}
        keyboardType="default"
      />
      <Button
        title="Buscar"
        onPress={buscarMedalhasPorPais}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {/* Exibir as medalhas */}
      <View style={styles.contMedalhas}>
        <Text style={styles.textoMedalha}>Medalhas de Ouro: {contagemMedalhas.gold || 0}</Text>
        <Text style={styles.textoMedalha}>Medalhas de Prata: {contagemMedalhas.silver || 0}</Text>
        <Text style={styles.textoMedalha}>Medalhas de Bronze: {contagemMedalhas.bronze || 0}</Text>
      </View>
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  titulo: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'light',
  },
  entrada: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  contMedalhas: {
    marginTop: 20,
  },
  textoMedalha: {
    fontSize: 16,
    marginBottom: 5,
  },
  erro: {
    color: 'red',
    marginTop: 10,
  },
});

export default App;
