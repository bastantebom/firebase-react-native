import { normalize } from '@/globals'
import { isUrl } from '@/globals/Utils'
import ImageApi from '@/services/image-api'
import React, { useEffect, useRef, useState } from 'react'
import Svg, { ClipPath, Defs, G, Image, Polygon, Use } from 'react-native-svg'

const HexagonImageMask = ({ path, size, dimensions }) => {
  const [source, setSource] = useState(null)
  const mounted = useRef(true)

  const handleOnPathChange = async path => {
    if (isUrl(path)) setSource(path)
    else if (path) {
      const uri =
        (await ImageApi.getUrl({ path, size: dimensions })) ||
        (await ImageApi.getUrl({ path }))

      if (!mounted.current) return
      setSource({ uri })
    }
  }

  useEffect(() => {
    handleOnPathChange(path)
  }, [path])

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  return (
    <>
      <Svg
        height={normalize(size)}
        width={normalize(size)}
        viewBox="0 0 100 100">
        <Defs>
          <Polygon
            id="clipPath"
            points="45 1.33975, 46.5798 0.60307, 48.26352 0.15192, 50 0, 51.73648 0.15192, 53.4202 0.60307, 55 1.33975, 89.64102 21.33975, 91.06889 22.33956, 92.30146 23.57212, 93.30127 25, 94.03794 26.5798, 94.48909 28.26352, 94.64102 30, 94.64102 70, 94.48909 71.73648, 94.03794 73.4202, 93.30127 75, 92.30146 76.42788, 91.06889 77.66044, 89.64102 78.66025, 55 98.66025, 53.4202 99.39693, 51.73648 99.84808, 50 100, 48.26352 99.84808, 46.5798 99.39693, 45 98.66025, 10.35898 78.66025, 8.93111 77.66044, 7.69854 76.42788, 6.69873 75, 5.96206 73.4202, 5.51091 71.73648, 5.35898 70, 5.35898 30, 5.51091 28.26352, 5.96206 26.5798, 6.69873 25, 7.69854 23.57212, 8.93111 22.33956, 10.35898 21.33975"
          />
          <ClipPath id="clip">
            <Use xlinkHref="#clipPath" />
          </ClipPath>
        </Defs>

        <Image
          width="100%"
          height="100%"
          href={source || require('@/assets/images/default-profile.png')}
          clipPath="#clip"
        />

        <G clipPath="#clip">
          <Use
            xlinkHref="#clipPath"
            stroke="#F7F7F8"
            strokeWidth="7"
            clipPath="#clipPath"
          />
        </G>
      </Svg>
    </>
  )
}

export default HexagonImageMask
