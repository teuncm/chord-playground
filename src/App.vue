<template>
  <!-- <ActionContainer />
  <Divider />
  <KeyContainer />
  <Divider />
  <ScaleContainer />
  <Divider />
  <NoteContainer /> -->
  <Test />

  <Test />
</template>

<script>
import ActionContainer from './components/ActionContainer.vue';
import KeyContainer from './components/KeyContainer.vue';
import ScaleContainer from './components/ScaleContainer.vue';
import NoteContainer from './components/NoteContainer.vue';
import Divider from './components/Divider.vue';
import Test from './components/Test.vue';

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
    Test,
  },
};
</script>