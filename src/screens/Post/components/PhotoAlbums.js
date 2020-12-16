import React, { useState } from 'react'
import { View } from 'react-native'

import { BottomSheetHeader, AppRadio, PaddingView } from '@/components'

export const PhotoAlbums = () => {
  const [radioButtons, setRadioButtons] = useState({
    All: true,
    Album: false,
    Event: false,
    Faces: false,
    Library: false,
    PhotoStream: false,
    SavedPhotos: false,
  })

  const radioHandler = label => {
    switch (label) {
      case 'All':
        setRadioButtons({
          All: true,
          Album: false,
          Event: false,
          Faces: false,
          Library: false,
          PhotoStream: false,
          SavedPhotos: false,
        })
        break
      case 'Album':
        setRadioButtons({
          All: false,
          Album: true,
          Event: false,
          Faces: false,
          Library: false,
          PhotoStream: false,
          SavedPhotos: false,
        })
        break
      case 'Event':
        setRadioButtons({
          All: false,
          Album: false,
          Event: true,
          Faces: false,
          Library: false,
          PhotoStream: false,
          SavedPhotos: false,
        })
        break
      case 'Faces':
        setRadioButtons({
          All: false,
          Album: false,
          Event: false,
          Faces: true,
          Library: false,
          PhotoStream: false,
          SavedPhotos: false,
        })
        break
      case 'Library':
        setRadioButtons({
          All: false,
          Album: false,
          Event: false,
          Faces: false,
          Library: true,
          PhotoStream: false,
          SavedPhotos: false,
        })
        break
      case 'PhotoStream':
        setRadioButtons({
          All: false,
          Album: false,
          Event: false,
          Faces: false,
          Library: false,
          PhotoStream: true,
          SavedPhotos: false,
        })
        break
      case 'SavedPhotos':
        setRadioButtons({
          All: false,
          Album: false,
          Event: false,
          Faces: false,
          Library: false,
          PhotoStream: false,
          SavedPhotos: true,
        })
        break
      default:
        break
    }
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <View style={{ justifyContent: 'space-between' }}>
          <AppRadio
            label="All"
            name="All"
            value={radioButtons.All}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Album"
            name="Album"
            value={radioButtons.Album}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Event"
            name="Event"
            value={radioButtons.Event}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Library"
            name="Library"
            value={radioButtons.Library}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Faces"
            name="Faces"
            value={radioButtons.Faces}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Photo Stream"
            name="PhotoStream"
            value={radioButtons.PhotoStream}
            valueChangeHandler={radioHandler}
            style={{ marginBottom: 16 }}
          />
          <AppRadio
            label="Saved Photos"
            name="SavedPhotos"
            value={radioButtons.SavedPhotos}
            valueChangeHandler={radioHandler}
          />
        </View>
      </PaddingView>
    </View>
  )
}
