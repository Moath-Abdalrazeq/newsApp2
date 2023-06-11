import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from "react-native-vector-icons";
import { firebase } from "../../config";
import LatestNews from './LatestNews';
import Map from './Map';
import AddNews from "./AddNews";
import LiveStream from './LiveStream';
import AcceptJournalist from "./AcceptJournalist";
import AdminAcceptNews from "./AdminAcceptNews";
import ProfilePageJournalist from './ProfilePageJournalist';

const Drawer = createDrawerNavigator();

const Menu = ({ user }) => {
  const handleChangePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        alert("Password reset email sent successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="LatestNews"
        component={LatestNews}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="newspaper" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Latest News</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Map"
        component={Map}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="map-marker-alt" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Map</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="AddNews"
        component={AddNews}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="plus" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Add News</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="LiveStream"
        component={LiveStream}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="stream" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Add LiveStream</Text>
            </View>
          ),
        }}
      />
      {user.isJournalist && (
        <Drawer.Screen
          name="Profile"
          component={ProfilePageJournalist}
          options={{
            drawerLabel: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="user" size={24} color="black" />
                <Text style={{ marginLeft: 10, fontSize: 20 }}>Profile</Text>
              </View>
            ),
          }}
        />
      )}
      <Drawer.Screen
        name="Settings"
        component={Settings}  
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="cog" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Settings</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="key" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Change Password</Text>
            </View>
          ),
        }}
        component={() => (
          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={handleChangePassword}>
            <Text style={{ fontSize: 20 }}>Change Password</Text>
          </TouchableOpacity>
        )}
      />
      <Drawer.Screen
        name="SignOut"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="sign-out-alt" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Sign Out</Text>
            </View>
          ),
        }}
        component={() => (
          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => firebase.auth().signOut()}>
            <Text style={{ fontSize: 20 }}>Sign Out</Text>
          </TouchableOpacity>
        )}
      />
      {user.isAdmin && (
        <>
          <Drawer.Screen
            name="AcceptJournalist"
            component={AcceptJournalist}
            options={{
              drawerLabel: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="users" size={24} color="black" />
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>Accept the Journalist</Text>
                </View>
              ),
            }}
          />
          <Drawer.Screen
            name="AdminAcceptNews"
            component={AdminAcceptNews}
            options={{
              drawerLabel: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="users" size={24} color="black" />
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>Accept the News</Text>
                </View>
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default Menu;
