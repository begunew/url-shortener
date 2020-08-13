class Urlshort extends React.Component {
  state = { url: "", error: "", slug: "", created: null };

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
      this.setState({ created: `http://localhost:3000/${result.slug}` });
    } else {
      const result = await response.json();
      this.setState({ error: result.message });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.createUrl}>
          <div className="error">{this.state.error}</div>
          <input
            placeholder="Enter a URL"
            type="text"
            onChange={this.handleChange}
            value={this.state.url}
            name="url"
            id="url"
          />
          <input
            placeholder="Enter a Slug [Optional]"
            type="text"
            value={this.state.slug}
            onChange={this.handleChange}
            name="slug"
            id="slug"
          />
          <button type="submit">Create</button>
        </form>
        <div>
          <p className="created">
            Your short URL is:{" "}
            <a id="created" href={this.state.created}>
              {this.state.created}
            </a>{" "}
            <button onClick={this.copyLink}>Copy</button>
          </p>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<Urlshort />, domContainer);
