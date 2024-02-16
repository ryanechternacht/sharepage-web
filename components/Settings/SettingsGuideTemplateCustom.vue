<template>
  <div class="[grid-area:center] page-center" v-scroll-spy>
    <template v-for="section in sections">
      <div class="section"
        v-if="section.type === 'simple-text'">
        <div class="group-header">{{ section.title }}</div>
        <div class="mt-4 inline-html" v-html="section.body.question" />
        <template v-if="section.body.showAnswer">
          <h4>{{ section.body.answerLabel }}</h4>
          <AutoSaveTipTapTextarea
            :model-value="section.body.answer"
            class="w-full mb-4"
            placeholder="Please enter an answer here"
            :on-update-fn="(text) => section.body.answer = text" />
        </template>
      </div>

      <div class="section"
        v-else-if="section.type === 'simple-list'">
        <div class="group-header">{{ section.title }}</div>
        <div class="mt-4 inline-html" v-html="section.body.question" />
        <div class="flex flex-col gap-4 mt-4">
          <div v-for="(c, i) in section.body.choices"
            class="item-list-row"
            :class="{'selected': i === section.body.answer.index}"
            @click="selectListIem({ section, choice: c, index: i })">
            <Tag v-if="c.tag"
              :color="i === section.body.answer.index ? 'dark-blue' : 'blue'">
              {{ c.tag }}
            </Tag>
            <div class="main-content">{{ c.text }}</div>
          </div>
        </div>
        <template v-if="section.body.showComment">
          <h4>{{ section.body.commentLabel }}</h4>
          <AutoSaveTipTapTextarea
            :model-value="section.body.comment"
            class="w-full mb-4"
            placeholder="Please enter an answer here" 
            :on-update-fn="(text) => section.body.comment = text" />
        </template>
      </div>

      <div class="section"
        v-else-if="section.type === 'yes-no-maybe'">
        <div class="group-header">{{ section.title }}</div>
        <div class="mt-4 inline-html" v-html="section.body.question" />
        <div class="flex flex-col gap-4 mt-4">
          <div v-for="p in section.body.prompts"
            class="feature-list">
            <div><!-- empty --></div>
            <h3>{{ p.text }}</h3>
            <div class="justify-center flex flex-row items-center gap-2">
              <div class="feature-button feature-button-yes"
              :class="{'selected': p.answer === 'yes',
                       'cursor-pointer': hasUser}"
              @click="p.answer = 'yes'">
              <CheckCircleIcon v-if="p.answer === 'yes'"
                class="[stroke:#08C4B2]" />
              <CheckCircleIcon v-else />
            </div>
            <div class="feature-button feature-button-maybe"
              :class="{'selected': p.answer === 'maybe',
                       'cursor-pointer': hasUser}"
              @click="p.answer = 'maybe'">
              <MinusCircleIcon v-if="p.answer === 'maybe'"
                class="[stroke:#FFBC00]" />
              <MinusCircleIcon v-else />
            </div>
            <div class="feature-button feature-button-no"
              :class="{'selected': p.answer === 'no',
                       'cursor-pointer': hasUser}"
              @click="p.answer = 'no'">
              <SlashIcon v-if="p.answer === 'no'"
                class="[stroke:#CE3665]" />
              <SlashIcon v-else />
            </div>
          </div>
            <div class="gray inline-html" v-html="p.title" />
          </div>
        </div>
        <template v-if="section.body.showComment">
          <h4>{{ section.body.commentLabel }}</h4>
          <AutoSaveTipTapTextarea
            :model-value="section.body.comment"
            class="w-full mb-4"
            placeholder="Please enter an answer here" 
            :on-update-fn="(text) => section.body.comment = text" />
        </template>
      </div>
    </template>

    <div class="section">
      {{ sections }}
    </div>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { isUserLoggedIn } = storeToRefs(usersStore)

const [hasUser] = await Promise.all([
  isUserLoggedIn.value(),
])

async function saveFeatureInterest (featureId, answer) {
  if (hasUser) {
    myFeatures.value.interests[featureId] = answer
    await buyersphereStore.updateBuyerInput({ buyersphereId, featuresAnswer: myFeatures })
  }
}

const sections = ref([{
  type: "simple-text",
  title: "Example Text",
  body: {
    question: "hello, world. I am text. <b>AND I AM BOLD</b>",
    showAnswer: false,
  },
}, {
  type: "simple-text",
  title: "Simple Text with Answer",
  body: {
    question: "hello, world. I am a question about life?",
    answerLabel: "Please enter your answer below:",
    answer: "a user typed me in",
    showAnswer: true,
  }
}, {
  type: "simple-list",
  title: "List Example",
  body: {
    question: "What is most important for you in this deal?",
    choices: [
      { text: "Price" },
      { text: "Speed" },
      { text: "Quality" },
    ],
    answer: {
      index: 2,
      text: "Quality"
    }
  }
}, {
  type: "simple-list",
  title: "List Example with Comment",
  body: {
    question: "What is most important for you in this deal?",
    choices: [
      { text: "Price" },
      { text: "Speed" },
      { text: "Quality" },
    ],
    answer: {
      index: 1,
      text: "Speed"
    },
    showComment: true,
    commentLabel: "Please add anything else",
    comment: "a user added me"
  }
}, {
  type: "simple-list",
  title: "List Example with Tags",
  body: {
    question: "What is most important for you in this deal?",
    choices: [
      { tag: "Price", text: "Holla holla, get that Dolla", },
      { tag: "Speed", text: "Gotta go fast!" },
      { tag: "Quality", text: "Bah, let them eat cake!" },
    ],
    answer: {
      index: 1,
      text: "Speed"
    },
    showComment: true,
    commentLabel: "Please add anything else",
    comment: "a user added me"
  }
}, {
  type: "yes-no-maybe",
  title: "Yes/No/Maybe",
  body: {
    question: "would you like this? yes? no? maybe?",
    prompts: [
      { 
        title: "Green Eggs?",
        text: "Do you like Green Eggs and Ham?", 
        answer: "yes"
      },
      {
        title: "Sam I am?",
        text: "Do you like the Sam I am?", 
        answer: "maybe"
      },
      {
        title: "Do you like choice?",
        text: "WOULD YOU LIKE THEM IN A HOUSE? WOULD YOU LIKE THEN WITH A MOUSE? WOULD YOU EAT THEM IN A BOX? WOULD YOU EAT THEM WITH A FOX?",
        answer: "no",
      },
    ],
  }
}, {
  type: "yes-no-maybe",
  title: "Yes/No/Maybe with Comment!",
  body: {
    question: "would you like this? yes? no? maybe?",
    prompts: [
      { 
        title: "Green Eggs?",
        text: "Do you like Green Eggs and Ham?", 
        answer: "yes"
      },
      {
        title: "Sam I am?",
        text: "Do you like the Sam I am?", 
        answer: "maybe"
      },
      {
        title: "Do you like choice?",
        text: "WOULD YOU LIKE THEM IN A HOUSE? WOULD YOU LIKE THEN WITH A MOUSE? WOULD YOU EAT THEM IN A BOX? WOULD YOU EAT THEM WITH A FOX?",
        answer: "no",
      },
    ],
    showComment: true,
    commentLabel: "Please add anything else",
    comment: "a user added me"
  }
}])

function selectListIem ({ section, choice, index }) {
  section.body.answer.text = choice.text
  section.body.answer.index = index
}

</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }

  &.selected {
    /* wish the bg-color didn't have to be important */
    @apply !bg-blue-background px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem] cursor-pointer;
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }
  }
}

.feature-list {
  @apply bg-white grid items-center gap-x-4 gap-y-1;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
      width: calc(100% + 2rem);
  
    .show-on-row-hover {
      @apply block;
    }
  }

  .show-on-row-hover {
    @apply hidden;
  }
}

.feature-button {
  @apply p-2 rounded-md border border-gray-border;

  &::before,
  &:hover::before {
    @apply absolute mt-[-2rem] tag
  }

  &.feature-button-yes {
    &:hover::before {
      @apply [content:"Yes"] ml-[-.25rem];
    }

    &.selected {
      @apply bg-green-background;

      &::before {
        @apply [content:"Yes"] ml-[-.25rem];
      }
    }
  }

  &.feature-button-maybe {
    &:hover::before {
      @apply [content:"Maybe"] ml-[-.75rem];
    }

    &.selected {
      @apply bg-orange-background;

      &::before {
        @apply [content:"Maybe"] ml-[-.75rem];
      }
    }
  }

  &.feature-button-no {
    &:hover::before {
      @apply [content:"No"];
    }

    &.selected {
      @apply bg-red-background;

      &::before {
        @apply [content:"No"];
      }
    }
  }
}
</style>
