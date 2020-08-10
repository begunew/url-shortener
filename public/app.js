const app = new Vue({
  el: "#app",
  data: {
    url: "",
    error: "",
    slug: "",
    created: null,
  },
  methods: {
    async createUrl() {
      const response = await fetch("/url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
          slug: this.slug || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        this.created = `http://localhost:3000/${result.slug}`;
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },
  },
});
