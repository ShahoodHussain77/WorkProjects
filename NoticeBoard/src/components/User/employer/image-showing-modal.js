import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class ShowImageModal extends Component {
  render() {
    return (
        <View>
            <Modal 
            animationType="slide"
            transparent={false}
            visible={this.state.showImageModal}
            onRequestClose={() => {
                this.setState({
                    showImageModal: false
                })
            }}>
                <TouchableOpacity activeOpacity={1} style={styles.modalContainerImage}  onPress={() => {animationFlag == 0 ? this.showImageText() : this.fadeImageText() }}>
                    <ImageBackground source={{uri: this.state.imagePath}} style={styles.modalImageStyle} resizeMode='contain'>
                        <Animated.View style={[styles.modalHeaderButton, {opacity: fadeAnim}]}>
                            <TouchableOpacity
                                style={styles.modalButtons}
                                onPress={() => this.closeImageModal()}>
                                <Icon name="md-arrow-round-back" size={20} color="#ddd" style={styles.buttonIcons}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtons}
                                onPress={() => this.downloadImage(this.state.imagePath)}>
                                <Image source={require('./../../../assets/icons/icon.png')} style={styles.buttonIcons}/>
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View style={[styles.modalImageText, {opacity: fadeAnim}]}>
                            <Text style={styles.imageText}>{this.state.imageText}</Text>
                        </Animated.View>
                    </ImageBackground>
                </TouchableOpacity>
            </Modal>
        </View>
    )
  }
}

export default ShowImageModal
