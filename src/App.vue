<template>
  <ActionContainer />
  <Divider />
  <KeyContainer />
  <Divider />
  <ScaleContainer />
  <Divider />
  <NoteContainer />
</template>

<script>
import ActionContainer from './components/ActionContainer.vue';
import KeyContainer from './components/KeyContainer.vue';
import ScaleContainer from './components/ScaleContainer.vue';
import NoteContainer from './components/NoteContainer.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'App',
  components: {
    ActionContainer,
    KeyContainer,
    ScaleContainer,
    NoteContainer,
    Divider,
  },
};
</script>