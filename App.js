import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import Constants from "expo-constants";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { BlurView } from "expo-blur";

import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

let data = [];

const month = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

const fetchFonts = () => {
  return Font.loadAsync({
    Avenir: require("./assets/fonts/Avenir-Medium.ttf"),
  });
};
const dim = Dimensions.get("screen");

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = month[currentDate.getMonth()];

export default function App() {
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newTask, setNewTask] = React.useState("");
  const [isData, setIsData] = React.useState(false);

  const storeData = async (obj) => {
    try {
      const jsonValue = JSON.stringify(obj);
      await AsyncStorage.setItem(Math.random().toString(), jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const readData = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys();

      await getData(keys);
    } catch (e) {
      // read key error
      // console.log(e);
    }
  };

  const getData = async (keys) => {
    try {
      for (let i = 0; i < keys.length; i++) {
        const jsonValue = await AsyncStorage.getItem(keys[i]);

        data.push(jsonValue != null ? JSON.parse(jsonValue) : null);

        // bugfix: duplicated entries
        // ! does not work
        await removeDuplicatedData(data);

        setIsData(true);
      }
    } catch (e) {
      // error reading value
      // console.log(e);
    }
  };
  const removeDuplicatedData = async (data) => {
    let result = data.filter((task, index) => {
      return (
        data.findIndex((currentTask) => {
          return currentTask.key == task.key;
        }) == index
      );
    });

    data = result;
    // console.log("DATATATTA: ",data);
    // console.log("RESULT: ",result);
  };
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  const plusButtonHandler = () => {
    setModalVisible(true);
  };

  const closeModalHandler = () => {
    setModalVisible(!modalVisible);
  };

  const addTaskButtonHandler = async () => {
    // add new task to database
    if (newTask !== "") {
      // add to db
      let obj = { key: newTask };
      await storeData(obj);
      await Alert.alert("Task Saved!");
      await readData();
      await setModalVisible(!modalVisible);
      setNewTask("");
    } else {
      Alert.alert("Please enter a valid task");
    }
  };

  return (
    <>
      <SafeAreaView>
        <View style={styles.body}>
          <View style={styles.centeredView}>
            <KeyboardAvoidingView>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
              >
                <BlurView
                  style={styles.centeredView}
                  tint="dark"
                  intensity={100}
                >
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={closeModalHandler}
                      style={{ alignSelf: "flex-end" }}
                    >
                      {/** alignSelf controls how a child aligns in the cross direction, overriding the alignItems of the parent.
                       * default: columns = cross ; rows = main
                       */}
                      <Ionicons
                        name="md-close-circle"
                        size={24}
                        color="#212128"
                      />
                    </TouchableOpacity>

                    <Text style={styles.modalText}>Add a task!</Text>

                    <TextInput
                      style={{
                        borderColor: "#212128",
                        borderBottomWidth: 2,
                        width: 0.4 * dim.width,
                        fontSize: 15,
                      }}
                      onChangeText={(text) => setNewTask(text)}
                      value={newTask}
                    />
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#DC4F64",
                        marginVertical: 20,
                      }}
                      onPress={addTaskButtonHandler}
                    >
                      <Text style={styles.textStyle}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Modal>
            </KeyboardAvoidingView>
          </View>
          <View style={styles.navbar}>
            <View style={styles.calendar}>
              <FontAwesome5
                name="calendar"
                size={45}
                color="#212128"
                style={styles.calendarIcon}
              />
              <Text style={styles.date} adjustsFontSizeToFit={false}>
                {currentDay}
              </Text>
            </View>

            <FontAwesome name="bars" size={45} color="#212128" />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}> Intray </Text>
          </View>
          <View style={styles.addButtonView}>
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={1}
              onPress={plusButtonHandler}
            >
              <Feather name="plus" size={50} color="white" />
            </TouchableOpacity>
          </View>
          {isData ? (
            <FlatList
              data={data}
              style={styles.flatList}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <TouchableOpacity>
                    <Text style={styles.cardText}>
                      {item.key ? item.key : "Undefined"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                marginTop: 50,
              }}
            >
              <Text
                style={{ fontFamily: "Avenir", fontSize: 20, color: "#DC4F64" }}
              >
                NO TASKS FOUND
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    height: dim.height,
    width: dim.width,
    backgroundColor:
      dim.height == Constants.statusBarHeight ? "white" : "#212128",
    paddingTop: Constants.statusBarHeight,
  },

  header: {
    height: 0.2 * dim.height,
    backgroundColor: "white",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  headerText: {
    fontSize: 60,
    color: "#212128",
    fontFamily: "Avenir",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#DC4F64",
    borderRadius: 30,
  },
  addButtonView: {
    paddingTop: 0.29 * dim.height,
    position: "absolute",
    alignSelf: "center",
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    height: 0.07 * dim.height,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },

  calendar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  calendarIcon: {
    position: "absolute",
  },

  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    margin: 45,
    backgroundColor: "#CC4F64",
    //* Android
    elevation: 3,
    // padding: 20, // controls height but why?!
    margin: 20,
    height: 95,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center", // yeahhh
    paddingLeft: 15,
  },
  cardText: {
    fontSize: 20,
    color: "#212128",
    fontFamily: "Avenir",
  },
  flatList: {
    marginVertical: 30,
  },

  ////
  centeredView: {
    // flex: 1, // YEINNNNNNNNNNN
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  modalView: {
    margin: 0.3 * dim.height,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 0.8 * dim.width, // good
    borderColor: "#212128",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10, // space inside
    elevation: 2,
    width: 0.2 * dim.width,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#212128",
    fontFamily: "Avenir",
    fontSize: 25,
  },
});
