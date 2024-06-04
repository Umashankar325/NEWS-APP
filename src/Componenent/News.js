import React, { Component } from "react";
import NewsComponent from "./NewsComponent";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 6,
    category: "general",
  };
  static propTypes = {
    // category:PropTypes.string
    // country:PropTypes.String,
    // pageSize:PropTypes.number
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0, // Initialize totalResults in the state
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-NewsMonkey`;
  }

  async update() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    // this.setState({
    //   loading: true,
    // });
    let data = await fetch(url);
    this.props.setProgress(30);

    let parsedata = await data.json();
    this.props.setProgress(50);

    this.setState({
      // loading: false,
      articles: parsedata.articles,
      totalResults: parsedata.totalResults,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.update();
  }

  handelPreviusClick = async () => {
    this.setState({
      page: this.state.page - 1,
    });
    this.update();
  };

  handelNextClick = async () => {
    this.setState({
      page: this.state.page + 1,
    });
    this.update();
  };



  // 986a3517dce3474192d87230c813a186
   fetchMoreData = async() => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    
      this.setState({page:this.state.page+1});
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    // this.setState({
    //   loading: true,
    // });
    let data = await fetch(url);

    let parsedata = await data.json();

    this.setState({
      // loading: false,
      articles: this.state.articles.concat(parsedata.articles),
      totalResults: parsedata.totalResults,
    });
  };

  render() {
    return (
      <div className="container my-3 ">
        <h1 className="text-center ">
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines{" "}
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div key={element.url} className="col-md-4  my-2">
                  <NewsComponent
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                    imgUrl={
                      !element.urlToImage
                        ? "https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2024/03/0/0/Kohls-mall-scaled.jpg?ve=1&tl=1"
                        : element.urlToImage
                    }
                    newsUrl={element.url}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>

       
      </div>
      // </div>
    );
  }
}

export default News;
