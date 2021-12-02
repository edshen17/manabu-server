const Social = {
  template: `
    <mj-section>
      <mj-social v-for="icon in iconData" :key="icon.name" font-size="12px" 
        icon-size="35px" mode="horizontal" padding-top="30px" padding-bottom="0px" 
        inner-padding="10px" border-radius="20px">
        <mj-social-element :name="icon.name" :href="icon.link"></mj-social-element>
      </mj-social>
    </mj-section>
  `,
  name: 'Social',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    iconData: {
      get() {
        return [
          {
            name: 'facebook',
            link: 'https://www.facebook.com/ManabuOfficial/',
          },
          {
            name: 'instagram',
            link: 'https://www.instagram.com/nihongo_manabu_/',
          },
          {
            name: 'twitter',
            link: 'https://twitter.com/lessonsmanabu',
          },
          {
            name: 'youtube',
            link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
          },
        ];
      },
    },
  },
};

export { Social };
