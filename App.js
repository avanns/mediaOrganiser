import React, {useCallback, useState} from 'react';
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

const App = () => {
  // const [fileResponse, setFileResponse] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEntry, setModalEntry] = useState();
  const [libraryContent, setLibraryContent] = useState([]);
  const [comment, setComment] = useState('');
  const {styles} = useStyle();
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);

  const handleDocumentSelection = useCallback(async () => {
    const addToArray = item => {
      setLibraryContent(oldLibrary => [...oldLibrary, item]);
    };
    const addComment = response => {
      const test = response[0];
      test.comment = comment;
      return test;
    };
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
        // allowMultiSelection: true,
        copyTo: 'documentDirectory',
      });
      const mediaItem = addComment(response);
      addToArray(mediaItem);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  // const openTextInput = () => {};

  // const onChangeText = (text) => {
  //   setComment(text);
  // };

  // const updateComment = (text, item) => {
  //   item?.comment = text;
  // };

  const removeMediaItem = uri => {
    const filteredData = libraryContent.filter(item => item.uri !== uri);
    setLibraryContent(filteredData);
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
            style={styles.bottomButton}
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

  const LibraryArea = () => {
    return (
      <View>
        <>
          <Text style={styles.title}>Library</Text>
          <FlatList
            data={libraryContent}
            renderItem={({item, index}) => (
              <View>
                <View style={styles.mediaItemHeader}>
                  <Text style={styles.indexNumber}>{index + 1}</Text>
                  <Pressable onPress={() => removeMediaItem(item.uri)}>
                    <Text>X</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.mediaItem}
                  onPress={() => {
                    setModalVisible(true);
                    setModalEntry(item);
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
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => `${item.key}${index}`}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <LibraryArea style={styles.libraryArea} />
      {/* <ItemCard /> */}
      {/* {fileResponse.map((file, index) => (
        <MediaItem
          key={index.toString()}
          numberOfLines={1}
          ellipsizeMode={'middle'}
          file={file}
        />
      ))} */}
      <Pressable onPress={handleDocumentSelection} style={styles.bottomButton}>
        <Text style={[styles.button, styles.bottomButtonTitle]}>
          Select File
        </Text>
      </Pressable>
    </SafeAreaView>
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
    libraryArea: {
      padding: 48,
    },
    mediaItem: {
      flexDirection: 'column',
      margin: 8,
      padding: 8,
      borderRadius: 5,
      width: (window.width - 32) / 2,
      backgroundColor: colours.tertiary,
    },
    title: {
      marginLeft: 8,
      marginBottom: 16,
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
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      fontSize: 48,
    },
    bottomButtonTitle: {
      fontSize: 20,
    },
    indexNumber: {
      // backgroundColor: 'white',
      width: 12,
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
      // position: 'absolute',
      // bottom: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: window.height - 100,
      width: '100%',
      height: 48,
      backgroundColor: colours.tertiary,
    },
  });

  return {styles};
};

export default App;
