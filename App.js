import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

const fetchFonts = () => {
  return Font.loadAsync({
    Avenir: require("./assets/fonts/Avenir-Medium.ttf"),
  });
};
const dim = Dimensions.get("screen");

const currentDate = new Date();
const currentDay = currentDate.getDate();

const tasks = {
  Task1: { name: "Pray", status: false },
  Task2: { name: "Pray", status: false },
  Task3: { name: "Pray", status: false },
  Task4: { name: "Pray", status: false },
};
export default function App() {
  const [dataLoaded, setDataLoaded] = React.useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }
  return (
    <>
      <SafeAreaView>
        <View style={styles.body}>
          <View style={styles.navbar}>
            <View style={styles.calendar}>
              <FontAwesome5
                name="calendar"
                size={40}
                color="#212128"
                style={styles.calendarIcon}
              />
              <Text style={styles.date} adjustsFontSizeToFit={true}>
                {currentDay}
              </Text>
            </View>
            {/* <Feather name="plus" size={50} color="#212128" /> */}
            <FontAwesome name="bars" size={40} color="#212128" />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}> Intray </Text>
          </View>
          <View style={styles.addButtonView}>
            <TouchableOpacity style={styles.addButton} activeOpacity={1}>
              <Feather name="plus" size={50} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Checkbox style={{ margin: 3 }} value={true} color={"#111122"} />
            <Text style={styles.cardText}>Hardcoded solutions ;)</Text>
          </View>
          <View style={styles.card}>
            <Checkbox style={{ margin: 3 }} value={false} color={"#111122"} />
            <Text style={styles.cardText}>FastAPI</Text>
          </View>
          <View style={styles.card}></View>
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
    // justifyContent: "flex-end",
    // paddingBottom: 1,
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
  addButtonText: {
    color: "white",
    fontSize: 60,
    fontWeight: "bold",
  },
  addButtonView: {
    paddingTop: 0.25 * dim.height, // 26 is total, -1 for the red circle
    position: "absolute",
    alignSelf: "center",
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    height: 0.06 * dim.height,
    justifyContent: "space-between",
    backgroundColor: "white",
    // padding: 5,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    //* iOS
    // shadowColor: "black",
    // shadowOpacity: 0.26,
    // shadowOffset: {
    //   height: 2, //towards bottom
    //   width: 0, // towards right
    // },
    marginTop: 45,
    backgroundColor: "#CC4F64",
    //* Android
    elevation: 3,
    padding: 25, // controls height but why?!
    margin: 20,
    height: 95,
    // paddingHorizontal: 100,
    borderRadius: 15,
    // fontSize: 47,
    flexDirection: "row",
  },
  cardText: {
    fontSize: 20,
    color: "#212128",
    fontFamily: "Avenir",
  },
});
