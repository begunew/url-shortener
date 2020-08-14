class Urlshort extends React.Component {
  state = { url: "", error: "", slug: "", vis: false, created: null };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  copyLink = async () => {
    let copyText = document.getElementById("created");

    var temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = copyText.innerText;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert("Copied Text!");
  };

  createUrl = async (e) => {
    this.setState({ error: "" });
    e.preventDefault();
    const response = await fetch("/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: this.state.url,
        slug: this.state.slug || undefined,
      }),
    });
    if (response.ok) {
      const result = await response.json();

      this.setState({
        vis: true,
        created: `http://localhost:3000/${result.slug}`,
      });
    } else {
      const result = await response.json();
      this.setState({ error: result.message });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.createUrl}>
          <div className="container">
            <div className="error">
              <h3>{this.state.error.toUpperCase()}</h3>
            </div>
            <input
              placeholder="Enter a URL"
              type="text"
              autocomplete="off"
              onChange={this.handleChange}
              value={this.state.url}
              name="url"
              id="url"
            />
            <input
              placeholder="Enter a Slug [Optional]"
              type="text"
              autocomplete="off"
              value={this.state.slug}
              onChange={this.handleChange}
              name="slug"
              id="slug"
            />
            <button type="submit">Create</button>
          </div>
        </form>
        <div className="url-created">
          <p className={this.state.vis ? "created" : "created-hid"}>
            Your short URL is: <br />
            <a id="created" target="_blank" href={this.state.created}>
              {this.state.created}
            </a>{" "}
            <button id="copy-but" onClick={this.copyLink}>
              Copy
            </button>
          </p>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<Urlshort />, domContainer);
