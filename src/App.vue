<template>
  <ActionContainer />
  <Divider />
  <ChordContainer />
  <Divider />
  <ShiftContainer />
  <Divider />
  <NoteContainer />
  <Divider />
  <TuningContainer />
  <Divider />
  <CopyrightContainer />
</template>

<script>
import ActionContainer from './components/ActionContainer.vue';
import NoteContainer from './components/NoteContainer.vue';
import Divider from './components/Divider.vue';
import ChordContainer from './components/ChordContainer.vue';
import ShiftContainer from './components/ShiftContainer.vue';
import TuningContainer from './components/TuningContainer.vue';
import CopyrightContainer from './components/CopyrightContainer.vue';

export default {
  name: 'App',
  components:
  {
    Divider,
    ActionContainer,
    ChordContainer,
    ShiftContainer,
    NoteContainer,
    TuningContainer,
    CopyrightContainer,
  },
};
</script>