import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import kebabCase from "lodash/kebabCase"

import twitterIcon from "../../content/assets/twitter-icon.png"
import githubIcon from "../../content/assets/github-icon.png"
import linkedinIcon from "../../content/assets/linkedin-icon.png"

import graphqlIcon from "../../content/assets/graphql-icon.png"
import gatsbyjsIcon from "../../content/assets/gatsby-icon.png"
import reactjsIcon from "../../content/assets/react-icon.png"

const TagsSidebar = ({ group }) => (
  <div>
    <div>
      <h3>About</h3>
      <ul>
        <li style={{}}>
          <img
            src={twitterIcon}
            alt="Twitter Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px",
            }}
          />
          &nbsp;
          <a href={`https://twitter.com/iOSRomanDev`}>Twitter</a>
        </li>
        <li>
          <img
            src={githubIcon}
            alt="GitHub Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px",
            }}
          />
          &nbsp;
          <a href={`https://github.com/roman-dzieciol`}>GitHub</a>
        </li>
        <li>
          <img
            src={linkedinIcon}
            alt="LinkedIn Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px",
            }}
          />
          &nbsp;
          <a href={`https://www.linkedin.com/in/romandzieciol/`}>LinkedIn</a>
        </li>
        <li>
          <a href={`mailto:roman.dzieciol@gmail.com`}><span role='img' aria-label='email'>✉️</span> Email</a>
        </li>
      </ul>

      <h3>Tags</h3>
      <ul>
        {group.map(tag => (
          <li key={tag.fieldValue} style={{}}>
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

class Layout extends React.Component {
  render() {
    const { location, title, group, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    console.log(group)

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          alignContent: "center",
          justifyContent: "center",
          //backgroundColor: "green",
        }}
      >
        <div
          style={{
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            width: '20%',
            //backgroundColor: "red",
            position: "-webkit-sticky",
            top: "0",
          }}
        />

        <div
          style={{
            width: '60%',
            maxWidth: rhythm(32),
            //backgroundColor: "orange",
          }}
        >
          <div
            style={{
              padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
              //backgroundColor: "yellow",
            }}
          >
            <header
              style={
                {
                  //backgroundColor: "blue",
                }
              }
            >
              {header}
            </header>
            <main>{children}</main>
          </div>
          <footer
            style={
              {
                //backgroundColor: "blue",
              }
            }
          >
            © {new Date().getFullYear()}, Built with <span role='img' aria-label='love'>❤️✨💛</span>
            {` `}
          <img
            src={reactjsIcon}
            alt="ReactJS Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px 4px 0px 10px",
            }}
          />
            <a href="https://www.reactjs.org">ReactJS</a>
            {` `}
          <img
            src={graphqlIcon}
            alt="GraphQL Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px 4px 0px 10px",
            }}
          />
            <a href="https://graphql.org">GraphQL</a>
            {` `}
          <img
            src={gatsbyjsIcon}
            alt="GatsbyJS Icon"
            style={{
              width: "1em",
              height: "1em",
              lineHeight: "1em",
              margin: "0px 4px 0px 10px",
            }}
          />
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>

        <div
          style={{
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            width: '20%',
            //backgroundColor: "red",
            position: "-webkit-sticky",
            top: "0",
          }}
        >
          {group && <TagsSidebar group={group} />}
        </div>
      </div>
    )
  }
}

export default Layout
