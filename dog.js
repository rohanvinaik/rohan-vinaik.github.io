// ============================================
// CUTE PIXEL ART DOG COMPANION
// Redesigned to actually look like a dog!
// ============================================

(function() {
  'use strict';

  // Color palette
  const COLORS = {
    0: null,            // transparent
    1: '#FFFFFF',       // white (body)
    2: '#000000',       // black (outline)
    3: '#FFB6C1'        // pink (tongue)
  };

  // ============================================
  // DOG SPRITE DATA - Much cuter and compact!
  // Based on Undertale's Annoying Dog
  // 24x24 sprites for better proportions
  // ============================================
  const dogSprites = {
    standRight: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    standLeft: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,2,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,2,2,1,1,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,1,2,2,1,1,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,2,2,2,1,1,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,2,2,1,1,1,1,1,1,1,1,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    sit: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,1,1,1,1,1,2,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,2,1,1,2,2,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,1,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,1,1,2,0,0,2,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    lie1: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
        [0,0,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0],
        [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,0,0,0],
        [0,2,1,2,2,1,2,1,1,1,1,1,1,1,1,1,1,1,2,2,1,2,0,0],
        [0,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,2,2,0,0],
        [0,2,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
        [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,2,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    lie2: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0],
        [0,0,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0],
        [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,0,0,0,0],
        [0,2,1,2,2,1,2,1,1,1,1,1,1,1,1,1,1,2,2,1,2,0,0,0],
        [0,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,0,2,2,0,0,0],
        [0,2,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0],
        [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,2,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    barkClosed: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    },

    barkOpen: {
      width: 24,
      height: 24,
      pixels: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,2,2,1,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,3,3,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,1,2,0,0,2,1,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ]
    }
  };

  // ============================================
  // DOG STATE
  // ============================================
  let dog = {
    element: null,
    canvasEl: null,
    ctx: null,
    enabled: false,

    x: 200,
    y: window.innerHeight - 120,

    targetX: null,
    targetY: null,
    walkSpeed: 2,
    isWalking: false,
    facingRight: true,
    walkFrame: 0,

    currentBehavior: 'idle',
    behaviorTimer: null,
    lastInteraction: Date.now(),

    animationFrame: null,
    frameCount: 0
  };

  // ============================================
  // CANVAS SETUP
  // ============================================
  function createDogCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = 24;
    canvas.height = 24;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '60px';
    canvas.style.left = dog.x + 'px';
    canvas.style.width = '48px';   // Display at 2x size
    canvas.style.height = '48px';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.zIndex = '500';
    canvas.style.cursor = 'pointer';
    canvas.style.display = 'none';

    canvas.addEventListener('click', petDog);

    document.body.appendChild(canvas);
    dog.canvasEl = canvas;
    dog.ctx = canvas.getContext('2d');
  }

  // ============================================
  // DRAW PIXEL DOG
  // ============================================
  function drawDog() {
    if (!dog.ctx) return;

    dog.ctx.clearRect(0, 0, dog.canvasEl.width, dog.canvasEl.height);

    let sprite;
    let yOffset = 0;

    if (dog.currentBehavior === 'sitting') {
      sprite = dogSprites.sit;
    } else if (dog.currentBehavior === 'lying') {
      const breathFrame = Math.floor(dog.frameCount / 60) % 2;
      sprite = breathFrame === 0 ? dogSprites.lie1 : dogSprites.lie2;
    } else if (dog.currentBehavior === 'barking') {
      const barkFrame = Math.floor(dog.frameCount / 8) % 2;
      sprite = barkFrame === 0 ? dogSprites.barkClosed : dogSprites.barkOpen;
      yOffset = barkFrame === 1 ? -2 : 0;
    } else if (dog.currentBehavior === 'excited') {
      const hopCycle = Math.floor(dog.frameCount / 4) % 4;
      if (hopCycle === 0) yOffset = 0;
      else if (hopCycle === 1) yOffset = -4;
      else if (hopCycle === 2) yOffset = -2;
      else yOffset = 0;
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    } else if (dog.isWalking) {
      const walkCycle = Math.floor(dog.walkFrame / 4) % 4;
      yOffset = (walkCycle === 1 || walkCycle === 3) ? -1 : 0;
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
      dog.walkFrame++;
    } else {
      const idleCycle = dog.frameCount % 240;
      if (idleCycle < 8) yOffset = -1;
      else if (idleCycle < 16) yOffset = 0;
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    }

    if (yOffset !== 0) {
      dog.ctx.save();
      dog.ctx.translate(0, yOffset);
    }

    const pixels = sprite.pixels;
    const pixelSize = 1;

    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const colorIndex = pixels[y][x];
        const color = COLORS[colorIndex];

        if (color) {
          dog.ctx.fillStyle = color;
          dog.ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    if (yOffset !== 0) {
      dog.ctx.restore();
    }
  }

  // ============================================
  // MOVEMENT & BEHAVIOR
  // ============================================

  function pickRandomDestination() {
    const screenWidth = window.innerWidth;
    const margin = 100;

    const destinations = [
      { x: margin },
      { x: screenWidth - margin },
      { x: screenWidth / 2 },
      { x: margin + Math.random() * 200 },
      { x: screenWidth - margin - Math.random() * 200 }
    ];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    dog.targetX = dest.x;
    dog.isWalking = true;
    dog.currentBehavior = 'walking';

    if (dest.x > dog.x) {
      dog.facingRight = true;
    } else {
      dog.facingRight = false;
    }
  }

  function updateMovement() {
    if (!dog.isWalking || dog.targetX === null) return;

    const distance = Math.abs(dog.targetX - dog.x);

    if (distance < dog.walkSpeed) {
      dog.x = dog.targetX;
      dog.isWalking = false;
      dog.targetX = null;
      dog.walkFrame = 0;

      scheduleNextBehavior();
      return;
    }

    if (dog.targetX > dog.x) {
      dog.x += dog.walkSpeed;
      dog.facingRight = true;
    } else {
      dog.x -= dog.walkSpeed;
      dog.facingRight = false;
    }

    dog.canvasEl.style.left = dog.x + 'px';
  }

  function scheduleNextBehavior() {
    const behaviors = [
      { action: 'sit', duration: 5000, weight: 3 },
      { action: 'lie', duration: 8000, weight: 2 },
      { action: 'stand', duration: 3000, weight: 4 },
      { action: 'walk', duration: 0, weight: 3 },
      { action: 'bark', duration: 2000, weight: 1 }
    ];

    const totalWeight = behaviors.reduce((sum, b) => sum + b.weight, 0);
    let random = Math.random() * totalWeight;

    for (const behavior of behaviors) {
      random -= behavior.weight;
      if (random <= 0) {
        executeBehavior(behavior.action, behavior.duration);
        break;
      }
    }
  }

  function executeBehavior(action, duration) {
    clearTimeout(dog.behaviorTimer);

    switch (action) {
      case 'sit':
        dog.currentBehavior = 'sitting';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'lie':
        dog.currentBehavior = 'lying';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'stand':
        dog.currentBehavior = 'idle';
        dog.behaviorTimer = setTimeout(() => {
          scheduleNextBehavior();
        }, duration);
        break;

      case 'walk':
        pickRandomDestination();
        break;

      case 'bark':
        dog.currentBehavior = 'barking';
        playBarkSound();
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;
    }
  }

  // ============================================
  // PET INTERACTION
  // ============================================
  function petDog() {
    clearTimeout(dog.behaviorTimer);
    dog.isWalking = false;
    dog.targetX = null;

    dog.currentBehavior = 'excited';

    playHappySound();

    dog.behaviorTimer = setTimeout(() => {
      dog.currentBehavior = 'idle';
      scheduleNextBehavior();
    }, 1500);

    if (window.AchievementSystem) {
      window.AchievementSystem.incrementDog();
    }

    dog.lastInteraction = Date.now();
  }

  // ============================================
  // MAIN ANIMATION LOOP
  // ============================================
  function startAnimationLoop() {
    function animate() {
      if (!dog.enabled) return;

      dog.frameCount++;

      updateMovement();

      drawDog();

      const timeSinceInteraction = Date.now() - dog.lastInteraction;
      if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying') {
        executeBehavior('lie', 30000);
      }

      dog.animationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  // ============================================
  // SOUND EFFECTS
  // ============================================
  function playBarkSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        gainNode.gain.value = settings.volume / 300;

        oscillator.start();
        setTimeout(() => {
          oscillator.frequency.value = 200;
        }, 50);
        setTimeout(() => oscillator.stop(), 150);
      } catch (e) {
        // Fail silently
      }
    }
  }

  function playHappySound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 400;

        oscillator.start();
        setTimeout(() => { oscillator.frequency.value = 500; }, 100);
        setTimeout(() => { oscillator.frequency.value = 600; }, 200);
        setTimeout(() => oscillator.stop(), 300);
      } catch (e) {
        // Fail silently
      }
    }
  }

  // ============================================
  // ENABLE/DISABLE DOG
  // ============================================
  function enableDog() {
    if (dog.enabled) return;

    dog.enabled = true;

    if (!dog.canvasEl) {
      createDogCanvas();
    }

    dog.canvasEl.style.display = 'block';

    dog.x = 100 + Math.random() * (window.innerWidth - 200);
    dog.canvasEl.style.left = dog.x + 'px';

    startAnimationLoop();

    setTimeout(() => scheduleNextBehavior(), 2000);
  }

  function disableDog() {
    if (!dog.enabled) return;

    dog.enabled = false;

    if (dog.canvasEl) {
      dog.canvasEl.style.display = 'none';
    }

    if (dog.animationFrame) {
      cancelAnimationFrame(dog.animationFrame);
    }

    clearTimeout(dog.behaviorTimer);
  }

  // ============================================
  // HIDDEN TRIGGER: "gooddog"
  // ============================================
  let commandBuffer = '';
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    commandBuffer += e.key;

    if (commandBuffer.endsWith('gooddog')) {
      if (dog.enabled) {
        petDog();
      } else {
        enableDog();
        setTimeout(() => petDog(), 1000);
      }
      commandBuffer = '';
    }

    if (commandBuffer.length > 20) {
      commandBuffer = '';
    }
  });

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  window.ASCIIDog = {
    enable: enableDog,
    disable: disableDog,
    isEnabled: () => dog.enabled
  };

  // ============================================
  // LOAD SAVED STATE
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.asciiDog) {
      enableDog();
    }

    const dogToggle = document.getElementById('enable-dog');
    if (dogToggle) {
      dogToggle.checked = settings.asciiDog || false;
      dogToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          enableDog();
        } else {
          disableDog();
        }

        settings.asciiDog = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

})();
