import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    FlatList
} from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import Post from '@/components/Post/Post';

import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';


function Dashboard({ navigation }) {
    const [modalState, setModalState] = useState(false)

    const toggleModal = () => {
        setModalState(!modalState);
    };

    function WrapperComponent() {
        return (
            <View style={{ flex: 1, backgroundColor: "red", paddingTop: 50 }}>
                <TouchableOpacity onPress={() => setModalState(false)}>
                    <Text>I am the modal content!</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const DummyData = [
        {
            id: 1,
            userImage: "https://qph.fs.quoracdn.net/main-qimg-a1e8f69ca6140981338015c818fec130",
            name: "Pia Samson",
            username: "Piasamson",
            rating: 3.5,
            createdAt: "1 week ago",
            isVerified: true,

            postType: "need",
            postImage: "https://mangjohnnys.com/pub/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/m/j/mjchgwr80a.jpg",
            postName: "I need someone to do my aircon",
            postPrice: {
                minimum: 199,
                maximum: 499
            },
            postServiceAddress: "#8 Atis Street",
            postServiceRadius: "500m",
            postDeliveryMethod: "Delivery and Pickup"
        },
        {
            id: 2,
            userImage: "https://reactnative.dev/img/tiny_logo.png",
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: "2 weeks ago",
            isVerified: true,

            postType: "Service",
            postImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUREhIVFRUWFRYVFhYYFRUXGhUVGBUWFhkVGRUYHSgiGhwlGxUYITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGyslICUtLSstKy0tLS0tKy0tLS0tKy0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLSstLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAgEDBAUGBwj/xAA+EAACAQIEAwYDBgMHBQEAAAAAAQIDEQQSITEFQVEGE2FxgZEHIqEUMmKxwfBy0fEjQlJTkqLhQ2OCssIz/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAIREBAQEBAAICAgMBAAAAAAAAAAECEQMhEjEEQSIyUYH/2gAMAwEAAhEDEQA/APUgAAAAAAAAAAKWKgClhYqUbAFGyLNbx7jVLC0nVqystklq23tp+oGyzmLj+K0aKzVakYL8UkvpzPIO0fb3EVnai3Sg1ZxUk+t/mS5p8vDzOLq4yUpN3b11cryb22v4kdWmXuVb4h4KLVpylvtCStbqnZmNL4mYS6tGo4tXbyrT05/8ni9Ks21e6euujVtOat9epdVVqTvrdXTV76dfDl6Ir2rfGPcMJ8QMDP8A6zi9vmp1FbzllsvVm+wmPhVipUqkZxeqcWn+R8906SstFe19+elmvF3X6lyhVlSblGUoSuleMnCSuvvRa1W/8hNHwfQ2djvDyHg/b/EUpKFWXfRvvOyfK6zpbq/NP05ejcB7QUcVFum7STtKm3HMn5J6rxLTUqtzY2+cZiJVFlVUXYstokiBcRUiiQAAAAAAAAAAAAAAAAAAAAAAAAAAACLJFGBreO8Wp4WjKtUe2kVe2aXKKPBe1HGKuLqd9PebjaMXpGNr5Yp+FrvxOz+J3FnWrfZoWyU21L8UrbeSvb1ZwP2ZqSz35JX2ta+nnYpa0zn0txjHRO8krK7fnr7CpQzJX33a5+nqyfc679Uvq7u3mUqVFq0rLbrqR1bjFVOPlbxexk4WLaulJLW/O2u2vW9y9hqV5arbe/tb6l9RdO1tVJX91t+/EjqeMaELxso63tySkne30/kVrUoJqfTe65N7fnqZVVJWfROz6qzYteztpdp+Gtv35jqeMWrBLXdWV/a/8zJweLnTmpqWWabayuzy6ap+Ce3RliEnHS3yrrfba9vK5bnosvNWTe+W6t+tvQIes9iu2XfWo4lrvG7QqaLvH/hlbRSfJrSX59sfPCnlbkm7K1vSTjdeqTPYOwfaH7VRy1GnVp6Plmhplnb6Py8S+b+mes/t1CJogiaLKJokRRIAAAAAAAAAAAAAAAAAAAAAAAIqAAKgUZicSxPdUqlW6WSEpa+CbX1Myxzfb+tlwNX8WWH+qSv9ExUz7eUwi5Nzldyk231bfN+pluirNNeOvj/T6EcLSzWklb3NhRovmudv35mFdEaeXCFdtPK9OV1suXma3EcLnBpyjfq1qtl7Hbww3J+b+v79S7Twztttuuvj++hHU8cHhqVm3fVWe2+2hkYegpvW7SV46LwuvodbX4TCV9LPk14vp6GqxHAaqf8AZx1ulo/qx0+NaTFUslPRXd7RXV6v2Td/RItV4yisjavJLZP5b/elfyTXqdFicC28uTVaLS2sXpbwVt/5GpxVGTlmS2vG+63S/QdibmtfPDOEYuW7vkil4K13/XmYrjZ2Wqa10td9X6m9xcZSt8v3bP0tv+qNHioNSb2XjtZ7u11ZfmTKi54tSrPVt36+7env9Ebrs5xd4evCtG+j1V7Zov70X6fW3Q5udZ302XVGTQqO8b32bb+r+hZR9IYXERqQjUg7xnFSi+sZJNfRl9HLfDrEueCgm23TlOnfwTzL0SkkdSjWe4xs5U0SIokEAAAAAAAAAAAAAAAAAAAAACoAAFQVQA4/4nyf2WnFf3q8fZQqP+R2JyXxChenQX/db9oSX/0RfpOftxXDMLouhvaGFXTW9+f75jhdD5Vpz/dzdYehbkYOlgU8H1/oX4YS373ubSnh78uWwlQS3/UcT1pamHa5dPoUw8LSTf1V7GynC+liKik9/P8Anb2M6vl09PB06lKMZwUk4rRq/LqYVXsrhXb+xjeKeV66X526mxwtX5YrwX5F+Uy3qqd1K4/jHYmjOGSPy3d2935+Zy+P+G9leFTM78/Lm92eoV5GsxdQzvptm9+3j3Fuw1anqop9Mrv7ow12Yrb5Hqlp0t/Q9crVTCr1tGTN0uJVfh7ge6wuVyvJ1JSl4SairLwsk/U6lI57szW+apHl8svzT/Q6FHXi9y4fJOasVRIiVRZRUAAAAAAAAAAAAAAAAAAAAAKlABIqiKJICpzXbfahf/Mkv9p0xynbzEZY0stNVJxleMW7LNLRX9FJ+hTd5nrTxYu9yRg8Kkvum9oRRo+EY+NV91WpdzWSTWzUlzyyX3l9TooYdpJnNNdrs8ni+MVgi3Wa2W7ZNuyI0KfPmy2tcZ5z1GGDvuyawMev5bknIweJ8aVFqOVybhKat4OKt5tyWhnO28jS8zOt5TeiLucxcJVzxjJbSSa05PwMtwtuTEXizUlcwMTTZspWRYrNEWJlaPEwa0MKvh2bPEO7XqMZJZb+F/oRxfrXdmY2rzXWF/8AdE6o5bs/VX2hv/FBpeNmn+jOpOvxf1cPm/uqVKIqjRkqAAAAAAAAAAAAAAAAAAAAAAACpVESSAmjk+LvNip5vu0ssl6wi/35nVo5njGHviJxe1WEbeLStb/a/Yx88/i6/wAOyeT/AI03aXjWBUVLM3Wi045IucrrlptdXTb5M3mA4tFpK97pNFmhwGlCF1C8mtbL6Fzs9wyPczuvmzyXkk9F7fmcvt2b5xkOrp5mTFmp7zK8r5GZRl4k9ZfFidoFOSjFZlTd+8lHdJW0vfnqtmteVizhOESq5KldppKzptXzWzqLcvFT1VtWltsb6k7lcRS00LzXJ6UuJb7WsXjHGNoOKt10NHj+MVYq8Jxb13k7ryaVvoY/G+E4hpuDlLwvFfmc5icU8LfvKUpJZfmTzq7aVmnOPVf3SJ7X5JFrHdrMXFuyv4t39tizT7c4mTUZU7K+r3uYXFO0brLJRpSvLRXhblu7ydlsjedneyjtGdTm1p0FnCXrbUuLPJnaastfFmDxztXCCyK0pZbNJ8zadu8B3WCmqTyySVnba7Sv6XPIuDYaUqri4zm00r5ldt/htcnOO+1d756dl2b+04zEx0ShBqUnmaUY35ZefTqewXNbwXhlOhTUKaVrJylbWcrfef70NijqznkcW9fKqlUUKllEgUKgAAAAAAAAAAAAAAAAAAAAABFSiKgSRr+NYDvYXSvKN2ktG1zSfJ6Jp9V4sz0VuRZ2cq2dXNljn+HYyUdZSzR2zWs+nzx5NbFO/dOUnmi4T1jaV3m56eVvYtdqsTDDOFeWkak8k+l8spKbXlFpmPXxNGVPNGUfCzWvgcW83N49LG55J2LWMnd3LuFrGCp3sX6CKJbqhUNjQnc52hWtoZ0MWTKixt6lnoabiPCYT5te2qfXQu/aCiqNluqzNjVYPs3Qg9Iq/Wy/JHSrDpKyRiUZczNhUvqkTCsDtDg+9w8o2u3Fr15HnvDsNFTpvW6qR0b2akro9WjJNOL5nDYfhEpcRelqcLVn0vyXrJX8ky+Z79Kbv8fbtmAUOpwJFSKKoCaCKIkAAAAAAAAAAAAAAAAAAAAAACpQAVBG4uBzHxHo5sLHwrQ/9Zq31PO+EcJVOp3ib0f/ABc7bt9xmN1gopuooxryfKMczhFeLbu/BLxOcw9TRvlLTylvF+TTt52MPK6fBxv8NG5nxh1NNwbE305o31NX1OWuyVY5korWxcqwLULohLLpUy/GJaoTuZcYXRaIWZZkm7XtsjUVu2Cj8kKNSo1uox2827JHRQaRgY6kpXyx5bpExM5+2qw3bim7ucXC3Kat7cn6Gx7N42VbPWySjTlbK5Jpz/Ek+XjzucBxfgs6f9vJP5m79FzXtseqYSGWnCK5QivaKRv4p29cv5G+T48XmwRbFzocaaJIgiSAmipFEkBUAAAAAAAAAAAAAAAAAAAAAKFSjAjco2UbLVevGEZTk7RinKT6JK7fsB5N2s4rCHGZtv5e7p0Zvo8qkn6OS+psFRirwk1lm7L110fm7rzZ5lxzGyrVqld7znKbXTM27emiNtwHtWlBUK98qtlna7h4W/vR8N147Gfkx33G3j3JOV09HESo1IuV7S0v+JaNPxOz4dilJJ3OViliKTd1JvZxd4ylFOzT/FHdbppms4dxOdFp6uD26pHNrLqxp6ei3OCNfwriSqxTTNk2ZNVaMEi9WxShHNJpLxaLHemJioxlpJXXTkTBj1u12GSv3im9flhecnb8Mbs5/iXxIcfljSqUo23lSld/Sxl8Y4tOjqsqj4WTSs167s1FTtnQ1zPM3yau/wCprJF8zP7rEfamvjHToRpzyzfdtuDinKaaV3b96nr0I2SXRJeysch2MTxEvtLpqFOF409Es89VKduiTa85PodedOJyPO/I1LvkVCKFUXYJomiCJoCSJkETAAAAAAAAAAAAAAAAAAAAAABCbKtlqTANnFfFbifdYPu1L5q04xtfXu0nKTt0vGK/8jcdrO0lPBUXOTi6jVqdO+s5dbb5Vu36btHg/FuK1a1WUq03Kc3fM9v4V0S5ImDWVZFicS7JakJdCUr+C4jVoPNTnKPk+nVPR+pv8F2nhKLjVjlbbd4rRX3+Xdelzmqc1tL3IVqNteRTWJVs7ufp3WB4l3bzUamZc43O84F2jhVVm7S6Hgyk1szMwPGalJ3vdeO68mYa8H+N8fkf6+i4xUtiSwp5f2f7fQsozfu7NHbUO1NGUbqcfcwubPt0zUv0yeI8ChV//RXiuXXzOQ4l2ToKou7jlbkkvNtL9To59oqX+YvQ4/tL2vVL5qDXeKScL62ad8zXTT1LYltV3qSe3rtGhGnGNOCtGKUYrokrEsx5dwL4tJ2jjKNn/mUtV603qvRs9B4XxajiY56FWNRc7PVfxReq9Ttec2KkVLNycJAXYsuRLJepgXESIokAAAAAAAAAAAAAAAAAAAAAAavjnGqGFjnr1YwXJPWUv4YLV+h5xx/4pSleGEpuCenezs5W6xhsn4tvyKAmQec43ESm5OcnKUndybbk34tmHSqKSyT3QBIrKPK97bPmvPqWZP3/ADAAg0I1nHR6oAgSdFS1g9ejLE4SWjiwAlZkn0J068o7Sa9WAQLyxk+c5f6mWactX4gAtXoyM/B4udKSnTnKEltKMnF+6AJg7bgnxNxFO0a8Y149fuTt/ElZ+q9TuuEdvcFWsu9dKT/u1Vl16Z1eP1AJ4h1kXdXWxdpPUAqMgAAAAAAAAAAAAB//2Q==",
            postName: "Haircut Service every Sat & Sun",
            postPrice: {
                minimum: 199,
                maximum: 499
            },
            postServiceAddress: "#8 Kaimito Street",
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        }
    ]

    const renderItem = ({ item }) => (
        <Post data={item} />
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal}>
                <AppText>Hello</AppText>
            </TouchableOpacity>
            {/* <Post data={DummyData[0]} />
            <Post data={DummyData[1]} /> */}

            <FlatList
                data={DummyData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            <Modal
                isVisible={modalState}
                animationIn="slideInRight"
                animationInTiming={1000}
                animationOut="slideOutRight"
                animationOutTiming={1000}
                onSwipeComplete={toggleModal}
                swipeDirection="right"
                customBackdrop={
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={{ flex: 1, backgroundColor: "black" }} />
                    </TouchableWithoutFeedback>
                }
            >
                <WrapperComponent />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 50
    }
})

export default Dashboard;