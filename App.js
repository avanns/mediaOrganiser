import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {useWindowDimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const App = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalEntry, setModalEntry] = React.useState();
  const [libraryContent, setLibraryContent] = React.useState([]);
  const [itemStore, setItemStore] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const {styles} = useStyle();
  const [isTextInputVisible, setIsTextInputVisible] = React.useState(false);
  const Stack = createNativeStackNavigator();

  const createId = prop => {
    const randomNumber = Math.trunc(Math.random() * 1000);
    const cleanProp = prop.replace(/\./g, '').replace(/\s+/g, '').toLowerCase();
    const id = cleanProp + randomNumber;
    return id;
  };

  const createPlaylist = title => {
    if (title) {
      const id = createId(title);
      let newPlaylist = {
        playlistTitle: title,
        playlistId: id,
      };
      setLibraryContent(oldPlaylist => [...oldPlaylist, newPlaylist]);
    } else {
      Alert.alert('Please enter a title');
    }
  };

  const createCategory = title => {
    if (title) {
      const id = createId(title);
      let newCategory = {
        categoryTitle: title,
        categoryId: id,
      };
      setLibraryContent(oldPlaylist => [...oldPlaylist, newCategory]);
    } else {
      Alert.alert('Please enter a title');
    }
  };

  const removePlaylistItem = id => {
    const filteredData = libraryContent.filter(item => item.playlistId !== id);
    setLibraryContent(filteredData);
  };

  const removeMediaItem = id => {
    const filteredData = itemStore.filter(item => item.id !== id);
    setItemStore(filteredData);
  };

  const ItemModal = ({item, modalVisible, onClose}) => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            onClose();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={(styles.modalText, styles.modalTitle)}>
                {item?.name}
              </Text>
              <Text style={styles.modalText}>{item?.uri}</Text>
              <Text style={styles.modalText}>
                Size: {(item?.size / 1000).toFixed(2)}Kb
              </Text>
              <Text style={styles.modalText}>Type: {item?.type}</Text>
              <Text style={styles.modalText}>Comment: {item?.comment}</Text>
              <Pressable style={[styles.buttonClose]} onPress={() => onClose()}>
                <Text style={styles.hideButton}>Close X</Text>
              </Pressable>
            </View>
          </View>
          {isTextInputVisible || !item?.comment ? (
            <View style={styles.textInput}>
              <TextInput
                placeholder="Add comment here..."
                onChangeText={text => (item.comment = text)}
                onEndEditing={() => setIsTextInputVisible(false)}
              />
            </View>
          ) : null}
          <Pressable
            style={styles.bottomButtonAbs}
            onPress={() => {
              setIsTextInputVisible('true');
            }}>
            <Text style={[styles.button, styles.bottomButtonTitle]}>
              {item?.comment ? 'Edit Comment' : 'Add Comment'}
            </Text>
          </Pressable>
        </Modal>
      </View>
    );
  };

  const HomeScreen = ({navigation}) => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <Pressable onPress={() => navigation.navigate('Create Playlist')}>
          <Text style={styles.button}>Add Playlist</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Create Category')}>
          <Text style={styles.button}>Add Category</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Playlists')}>
          <Text style={styles.button}>View Playlists</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.button}>View Categories</Text>
        </Pressable>
      </SafeAreaView>
    );
  };

  const PlaylistsScreen = ({navigation}) => {
    return (
      <View>
        <>
          <Text style={styles.title}></Text>
          <FlatList
            data={libraryContent}
            renderItem={({item, index}) =>
              item?.playlistId ? (
                <View style={styles.itemCard}>
                  <Pressable
                    style={styles.mediaItem}
                    onPress={() => {
                      navigation.navigate('Playlist', {
                        playlistId: item.playlistId,
                      });
                    }}>
                    <Text
                      style={styles.itemTitle}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.playlistTitle}
                    </Text>
                    <Text
                      style={styles.itemText}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.uri}
                    </Text>
                    <Text style={styles.itemText}>{item?.type}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removePlaylistItem(item.playlistId)}>
                    <Text style={{color: 'white'}}>-</Text>
                  </Pressable>
                </View>
              ) : null
            }
          />
        </>

        <ItemModal
          item={modalEntry}
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  };

  const CategoriesScreen = ({navigation}) => {
    return (
      <View>
        <>
          <Text style={styles.title}></Text>
          <FlatList
            data={libraryContent}
            renderItem={({item, index}) =>
              item?.categoryId ? (
                <View style={styles.itemCard}>
                  <Pressable
                    style={styles.mediaItem}
                    onPress={() => {
                      navigation.navigate('Category', {
                        categoryId: item.categoryId,
                      });
                    }}>
                    <Text
                      style={styles.itemTitle}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.categoryTitle}
                    </Text>
                    <Text
                      style={styles.itemText}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.uri}
                    </Text>
                    <Text style={styles.itemText}>{item?.type}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removePlaylistItem(item.categoryId)}>
                    <Text style={{color: 'white'}}>-</Text>
                  </Pressable>
                </View>
              ) : null
            }
          />
        </>

        <ItemModal
          item={modalEntry}
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  };

  const CreatePlaylistScreen = ({navigation}) => {
    let title;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <TextInput
          placeholder="Type playlist title here"
          onChangeText={text => (title = text)}
          style={styles.playlistTextInput}
        />
        <Pressable
          onPress={() => {
            createPlaylist(title);
            if (title) {
              navigation.navigate('Playlists');
            }
          }}
          style={styles.bottomButton}>
          <Text style={[styles.button, styles.bottomButtonTitle]}>
            Create Playlist
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  };

  const CreateCategoryScreen = ({navigation}) => {
    let title;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <TextInput
          placeholder="Type category title here"
          onChangeText={text => (title = text)}
          style={styles.playlistTextInput}
        />
        <Pressable
          onPress={() => {
            createCategory(title);
            if (title) {
              navigation.navigate('Categories');
            }
          }}
          style={styles.bottomButton}>
          <Text style={[styles.button, styles.bottomButtonTitle]}>
            Create Category
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  };

  const PlaylistScreen = ({route}) => {
    const handleDocumentSelection = async () => {
      const addToLibrary = item => {
        setItemStore(oldPlaylist => [...oldPlaylist, item]);
      };

      const addFields = response => {
        const nakedResponse = response[0];
        nakedResponse.comment = comment;
        // nakedResponse.categoryId = '';
        nakedResponse.playlistId = currentPlaylist.playlistId;
        nakedResponse.id = createId(response[0].name);
        return nakedResponse;
      };
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          // allowMultiSelection: true,
          copyTo: 'documentDirectory',
        });

        const mediaItem = addFields(response);

        addToLibrary(mediaItem);
      } catch (err) {
        console.warn(err);
      }
    };

    const passedPlaylistId = route.params.playlistId;
    const libraryContentAsArray = Object.entries(libraryContent);

    const getCurrentPlaylist = () => {
      for (const item of libraryContentAsArray) {
        if (item[1].playlistId === passedPlaylistId) {
          const currentPlaylist = item[1];
          return currentPlaylist;
        }
      }
    };
    const currentPlaylist = getCurrentPlaylist();
    console.log(currentPlaylist);
    return (
      <View style={styles.fullHeight}>
        <>
          <Text style={styles.title}>{currentPlaylist.playlistTitle}</Text>
          <FlatList
            data={itemStore}
            renderItem={({item}) =>
              item?.playlistId &&
              item.playlistId === currentPlaylist.playlistId ? (
                <View style={styles.itemCard}>
                  <Pressable
                    style={styles.mediaItem}
                    onPress={() => {
                      if (item.name) {
                        setModalVisible(true);
                        setModalEntry(item);
                      }
                    }}>
                    <Text
                      style={styles.itemTitle}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.name}
                    </Text>
                    <Text
                      style={styles.itemText}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.uri}
                    </Text>
                    <Text style={styles.itemText}>{item?.type}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() =>
                      item.id
                        ? removeMediaItem(item.id)
                        : Alert.alert('Cannot delete')
                    }>
                    <Text style={{color: 'white'}}>-</Text>
                  </Pressable>
                </View>
              ) : null
            }
          />
        </>
        <Pressable
          onPress={() => handleDocumentSelection()}
          style={styles.bottomButton2}>
          <Text style={[styles.button, styles.bottomButtonTitle]}>
            Add File
          </Text>
        </Pressable>
        <ItemModal
          item={modalEntry}
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  };

  const CategoryScreen = ({route}) => {
    const handleDocumentSelection = async () => {
      const addToLibrary = item => {
        setItemStore(oldPlaylist => [...oldPlaylist, item]);
      };

      const addFields = response => {
        const nakedResponse = response[0];
        nakedResponse.comment = comment;
        // nakedResponse.playlistId = '';
        nakedResponse.categoryId = currentCategory.categoryId;
        nakedResponse.id = createId(response[0].name);
        return nakedResponse;
      };
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          // allowMultiSelection: true,
          copyTo: 'documentDirectory',
        });

        const mediaItem = addFields(response);

        addToLibrary(mediaItem);
      } catch (err) {
        console.warn(err);
      }
    };

    const passedCategoryId = route.params.categoryId;
    const libraryContentAsArray = Object.entries(libraryContent);

    const getCurrentCategory = () => {
      for (const item of libraryContentAsArray) {
        if (item[1].categoryId === passedCategoryId) {
          const currentCategory = item[1];
          return currentCategory;
        }
      }
    };
    const currentCategory = getCurrentCategory();

    return (
      <View style={styles.fullHeight}>
        <>
          <Text style={styles.title}>{currentCategory.categoryTitle}</Text>
          <FlatList
            data={itemStore}
            renderItem={({item}) =>
              item?.categoryId &&
              item?.categoryId === currentCategory.categoryId ? (
                <View style={styles.itemCard}>
                  <Pressable
                    style={styles.mediaItem}
                    onPress={() => {
                      if (item.name) {
                        setModalVisible(true);
                        setModalEntry(item);
                      }
                    }}>
                    <Text
                      style={styles.itemTitle}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.name}
                    </Text>
                    <Text
                      style={styles.itemText}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {item?.uri}
                    </Text>
                    <Text style={styles.itemText}>{item?.type}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() =>
                      item.id
                        ? removeMediaItem(item.id)
                        : Alert.alert('Cannot delete')
                    }>
                    <Text style={{color: 'white'}}>-</Text>
                  </Pressable>
                </View>
              ) : null
            }
          />
        </>
        <Pressable
          onPress={() => handleDocumentSelection()}
          style={styles.bottomButton2}>
          <Text style={[styles.button, styles.bottomButtonTitle]}>
            Add File
          </Text>
        </Pressable>
        <ItemModal
          item={modalEntry}
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen name="Playlists" component={PlaylistsScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Create Category" component={CreateCategoryScreen} />
        <Stack.Screen name="Create Playlist" component={CreatePlaylistScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styling

const useStyle = () => {
  const window = useWindowDimensions();
  const colours = {
    primary: 'rgb(6, 44, 48)',
    secondary: 'rgb(5, 89, 91)',
    tertiary: 'rgb(226, 215, 132)',
    quaternary: 'rgb(245, 245, 245)',
  };
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colours.quaternary,
      paddingTop: 148,
      paddingHorizontal: 8,
      display: 'flex',
      height: window.height,
    },
    button: {
      width: 'auto',
      paddingHorizontal: 32,
      paddingVertical: 12,
      backgroundColor: colours.secondary,
      color: colours.quaternary,
      borderRadius: 10,
      textAlign: 'center',
    },
    playlistScreen: {
      padding: 48,
    },
    mediaItem: {
      flexDirection: 'column',
      margin: 8,
      padding: 8,
      borderRadius: 5,
      width: window.width - 32 - 44,
      backgroundColor: colours.tertiary,
    },
    title: {
      marginLeft: 8,
      marginBottom: 16,
      marginTop: 8,
      fontSize: 24,
      color: colours.primary,
    },
    centeredView: {
      flex: 1,
      position: 'absolute',
      top: 100,
      left: (window.width - 224) / 2,
    },
    mediaItemHeader: {
      paddingHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalView: {
      backgroundColor: colours.secondary,
      padding: 8,
      width: 224,
      borderRadius: 5,
    },
    modalText: {
      color: colours.tertiary,
      marginVertical: 8,
    },
    modalTitle: {
      fontSize: 24,
      color: colours.quaternary,
    },
    hideButton: {
      paddingTop: 32,
      color: colours.quaternary,
      marginLeft: 'auto',
    },
    bottomButton: {
      position: 'absolute',
      bottom: 64,
      width: window.width,
      textAlign: 'center',
      fontSize: 48,
    },
    bottomButton2: {
      position: 'absolute',
      width: window.width,
      marginTop: window.height - 112,
    },
    bottomButtonAbs: {
      position: 'absolute',
      bottom: 0,
      width: window.width,
    },
    bottomButtonTitle: {
      fontSize: 20,
    },
    indexNumber: {
      borderRadius: 4,
      textAlign: 'center',
    },
    itemText: {
      marginVertical: 4,
    },
    itemTitle: {
      fontSize: 18,
    },
    textInput: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: window.height - 100,
      width: '100%',
      height: 48,
      backgroundColor: colours.tertiary,
    },
    playlistTextInput: {
      marginTop: window.height / 3,
      textAlign: 'center',
      backgroundColor: 'white',
      height: 44,
    },
    removeButton: {
      width: 44,
      height: 44,
      borderRadius: 100,
      backgroundColor: 'black',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    itemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fullHeight: {
      height: window.height - 112,
    },
  });

  return {styles};
};

export default App;
