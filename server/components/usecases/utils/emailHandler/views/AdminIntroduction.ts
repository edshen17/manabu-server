const AdminIntroduction = {
  template: `
<mjml>
  <mj-body>
    <mj-column>
      <mj-text padding-left="0px" mj-class="table-text">
        Dear {{name}}-san,
      </mj-text>
      <mj-text padding-left="0px">
        Hi, this is Misaki from Manabu Japanese lessons!😊
      </mj-text>
      <mj-text padding-left="0px">
        Thank you for signing up for Manabu today!
      </mj-text>
      <mj-text padding-left="0px">
        I will be your go-to person if you need any help or assistance with anything in regards to your learning, membership plan, and other Manabu experiences!
      </mj-text>
      <mj-text padding-left="0px">
        Have you been able to decide on your Japanese teacher? Also, do you happen to have a Line account? I would really appreciate it if you could give us your Line ID. That way, communication is a lot easier with your teacher and us, and you can ask questions more easily since we use Line the most! 😊✨
      </mj-text>
      <mj-text padding-left="0px">
        My Line ID is 3710misaki.
      </mj-text>
      <mj-text padding-left="0px">
        My Whatsapp ID is (65)88158187.
      </mj-text>
      <mj-text padding-left="0px">
        You can also scan my QR code below :)
      </mj-text>
      <mj-image align="left" src="https://storage.googleapis.com/japanese-221819.appspot.com/cdn/line.jpg" width="150px" height="150px" alt="logo" padding-left="0px" />
      <mj-text padding-left="0px">
        Best Regards,
      </mj-text>
      <mj-text padding-top="0px" padding-left="0px">Misaki.</mj-text>
      <mj-text padding-left="0px" padding-top="0px">
        <a href="https://manabu.sg/">Manabu</a>
      </mj-text>
    </mj-column>
  </mj-body>
</mjml>
  `,
  name: 'EmailVerification',
  components: {},
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
};

export { AdminIntroduction };
