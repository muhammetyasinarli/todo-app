
import 'intl-pluralrules';
import './lang/i18n'
import React, { useState, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from './components/Task';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'i import ediyoruz


export default function App() {
  const { t } = useTranslation();
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  // Component ilk yüklendiğinde AsyncStorage'den verileri yükle
  useEffect(() => {
    loadTasks();
  }, []);

  // AsyncStorage'den görevleri yükle
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTaskItems(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  // AsyncStorage'e görev ekle
  const saveTask = async (newTask) => {
    try {
      const updatedTasks = [...taskItems, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTaskItems(updatedTasks);
    } catch (error) {
      console.error('Error saving task to AsyncStorage:', error);
    }
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task) {
      saveTask(task);
      setTask(null);
    }
  };

  const completeTask = async (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(itemsCopy));
      setTaskItems(itemsCopy);
    } catch (error) {
      console.error('Error updating tasks in AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>{t('todaysTasks')}</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={t('addProduct')}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
