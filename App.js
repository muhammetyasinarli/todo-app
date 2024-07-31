import 'intl-pluralrules';
import './lang/i18n';
import React, { useState, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from './components/Task';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function App() {
  const { t } = useTranslation();
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [inputFocused, setInputFocused] = useState(false); // Yeni state

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        const tasks = JSON.parse(storedTasks);
        setTaskItems(tasks);
        filterTasks(tasks);
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  const filterTasks = (tasks) => {
    const today = moment().startOf('day');
    const todayTasks = tasks.filter(task => moment(task.date).isSame(today, 'day'));
    const pastTasks = tasks.filter(task => !moment(task.date).isSame(today, 'day'));

    setTodayTasks(todayTasks);
    setPastTasks(pastTasks);
  };

  const saveTask = async (newTask) => {
    try {
      const updatedTasks = [...taskItems, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTaskItems(updatedTasks);
      filterTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving task to AsyncStorage:', error);
    }
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task) {
      const newTask = { text: task, date: new Date() };
      saveTask(newTask);
      setTask('');
    }
  };

  const completeTask = async (index, taskType) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(itemsCopy));
      setTaskItems(itemsCopy);
      filterTasks(itemsCopy);
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

            <>
              <Text style={styles.sectionTitle}>{t('todaysTasks')}</Text>
              <View style={styles.items}>
                {todayTasks.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => completeTask(index, 'today')}>
                    <Task text={item.text} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={inputFocused ? styles.inputFocused : styles.input} // Şartlı stil kullanımı
          placeholder={t('addProduct')}
          value={task}
          onChangeText={(text) => setTask(text)}
          onFocus={() => setInputFocused(true)} // Odaklanma olayı
          onBlur={() => setInputFocused(false)} // Odaklanma kaldırılma olayı
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
    width: '50%',
    // height: 50,
  },
  inputFocused: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '75%',
    // height: 70,
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
  bottomButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6EB5E5',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    width: '100%',
  },
  bottomButtonText: {
    color: '#FFF',
    fontSize: 10,
  },
});
