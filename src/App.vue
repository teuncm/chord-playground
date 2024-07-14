<template>
  <ActionContainer />
  <Divider />
  <ChordContainer />
  <Divider />
  <ShiftContainer />
  <Divider />
  <NoteContainer />
</template>

<script>
import ActionContainer from './components/ActionContainer.vue';
import NoteContainer from './components/NoteContainer.vue';
import Divider from './components/Divider.vue';
import ChordContainer from './components/ChordContainer.vue';
import ShiftContainer from './components/ShiftContainer.vue';

export default {
  name: 'App',
  // components: {
  //   ActionContainer,
  //   KeyContainer,
  //   ScaleContainer,
  //   NoteContainer,
  //   Divider,
  // },

  components:
  {
    Divider,
    ActionContainer,
    ChordContainer,
    ShiftContainer,
    NoteContainer
  },
};
</script>