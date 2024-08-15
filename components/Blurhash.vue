<template>
  <canvas ref="canvas" :width="currentWidth" :height="currentHeight" />
</template>

<script>
// Stolen shamelessly from https://github.com/suryaadtmaja/nuxt-blurhash/blob/master/lib/components/BlurHash.vue
// This version hasn't been made vue3 compatible yet

import { decode } from 'blurhash'
const parseNumber = (number) => {
  return typeof number === 'number' ? number : parseInt(number, 10)
}

export default {
  props: {
    hash: {
      type: String,
      required: true
    },
    width: {
      type: [Number, String],
      default: 128
    },
    height: {
      type: [Number, String],
      default: 128
    },
    punch: {
      type: Number,
      default: 1
    }
  },
  computed: {
    currentPunch: {
      get () {
        return parseNumber(this.punch)
      }
    },
    currentWidth: {
      get () {
        return parseNumber(this.width)
      }
    },
    currentHeight: {
      get () {
        return parseNumber(this.height)
      }
    },
    watchers: {
      get () {
        return [this.hash, this.width, this.height, this.punch]
      }
    }
  },
  watch: {
    watchers: [
      {
        handler: 'updateCanvas',
        immediate: false,
        deep: false
      }
    ]
  },
  mounted () {
    this.draw()
  },
  methods: {
    async updateCanvas () {
      await this.$nextTick()
      this.draw()
    },
    draw () {
      const pixels = decode(
        this.hash,
        this.currentWidth,
        this.currentHeight,
        this.punch
      )
      const ctx = this.$refs.canvas.getContext('2d')
      const imageData = ctx.createImageData(
        this.currentWidth,
        this.currentHeight
      )
      imageData.data.set(pixels)
      ctx.putImageData(imageData, 0, 0)
    }
  }
}
</script>