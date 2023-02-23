const hsPage = pageText => `
<div class="epilogues"> <div class="pageBody customStyles theme-Denizenthemes-0"> <nav class="navBanner customNavBanner pixelated"> <div class="navList"> <a href="/">HOMESTUCK COLLECTION</a> <div class="candyCorn"></div><a href="/help">HELP</a> <div class="candyCorn"></div><a href="/map">MAP</a> <div class="sep">|</div><a href="/log">LOG</a> <div class="sep">|</div><a href="/search">SEARCH</a> <div class="candyCorn"></div><a href="/news">NEWS</a> <div class="sep">|</div><a href="/music">MUSIC</a> <div class="candyCorn"></div><a href="/evenmore">MORE</a> <div class="sep">|</div><a href="/settings">SETTINGS</a> <div class="sep">|</div><a href="/credits">CREDITS</a> </div></nav> <div class="pageFrame"> <div class="pageContent"> <div class="story-text"> ${pageText}</div> </div></div><div class="footer " style="width: 950px;"><img src="assets://images/mspalogo_mspa.png" alt="" draggable="false" class="bannerImage left"><img src="assets://images/mspalogo_mspa.png" alt="" draggable="false" class="bannerImage right"></div></div></div>
`

const arrow = link => `<div class="arrow"> <div> <span>&gt;</span> <a href="${link}">==&gt; </a><br></div></div>`

const bottomLinks = link => `<div class="bottomLinks"> <a href="/EPILOGUES">Start Over</a> | <a href="${link}">Go Back</a> </div>`

const numbers = ["EPILOGUE One", "EPILOGUE Two", "EPILOGUE Three", "EPILOGUE Four", "EPILOGUE Five", "EPILOGUE Six", "EPILOGUE Seven", "EPILOGUE Eight", "POSTSCRIPT"]

module.exports = {
  title: "Homestuck Epilogues", 
  author: "FlaringK (<a href='https://flaringk.github.io/'>Here's my uber cool site</a>)",
  modVersion: 1.0,

  summary: "A port of the homestuck epilogues for the UHC. It'll appear at the bottom of the homscreen.",
  description: "Ten years after their adventure began, the heroes are enjoying a well-earned retirement on Earth C. But John still has one last choice to make. <br><br> A port of the homestuck epilogues for the UHC, it'll appear at the bottom of the homscreen. <br> <br> This is an unofficial port, the homestuck epilogues are planned to be included within the UHC by default in a later update.",

  edit: true,

  trees: {
    './assets/': 'assets://images/'
  },


  computed(api) {
    const epilogueData = api.readJson('./hsepl.json')
    const epiloguePages = {}

    let addPages = (pages, url, finalFooter, img, chapters, postscript) => {
      let chapNumber = 0
      pages.forEach((page, i) => {

        // Page number
        if (!(i == pages.length - 1 && postscript)) {
          if (img) page = `<h2 class=\"chaptitle\"><img src="${img}" class="titleimg">${i + 1}</h2>` + page
          else page = `<h2 class=\"chaptitle\">${i + 1}</h2>` + page
        }

        // Chapter title
        if (chapters) {
          if (chapters.includes(i + 1)) {
            page = `<h2 class=\"chaptitle\">${numbers[chapNumber].toUpperCase()}</h2>` + page
            chapNumber += 1
          }
        }

        // Section title
        if (i == 0) page = `<h2 class=\"chaptitle\">${url}</h2>` + page

        // Arrows + footers
        if (!(i == pages.length - 1)) page = page + arrow(`/EPILOGUES-${url}-${i + 2}`)
        else page = page + finalFooter

        // Bottom links
        if (i == 0) {
          if (img) page = page + bottomLinks("/EPILOGUES-PROLOGUE-3")
          else page = page + bottomLinks("/EPILOGUES")
        }
        else page = page + bottomLinks(`/EPILOGUES-${url}-${i}`)

        epiloguePages[`EPILOGUES-${url}-${i + 1}`] = {
          component: {
            title: () => `${url} ${i + 1} - The Homestuck Epilogues`,
            next: () => `/EPILOGUES-${url}-${i + 1}`,
            template: hsPage(page)
          },
          scss: ""
        }
        
      })
    }

    epiloguePages[`EPILOGUES`] = {
      component: {
        title: () => "The Homestuck Epilogues",
        next: () => `/EPILOGUES`,
        template: hsPage(epilogueData.home).replace("pageContent", "pageContent titlePage")
      },
      scss: ""
    }

    addPages(epilogueData.prologue, "PROLOGUE", epilogueData.prologueFooter)
    addPages(epilogueData.meat, "MEAT", "", "assets://images/meat.png", epilogueData.meatChapters, true)
    addPages(epilogueData.candy, "CANDY", "", "assets://images/candy.png", epilogueData.candyChapters, true)

    return {

      styles: [ { source: "./epiloguesStyle.css" } ],

      edit(archive) {
        archive.tweaks.modHomeRowItems.push({
          href: "/EPILOGUES",
          thumbsrc: "assets://images/epilogueIcon.gif",
          title: "The Homestuck Epilogues",
          date: "Apr 2019",
          description: "Tales of dubious authenticity."
        });
      },

      browserPages: epiloguePages

    }

  }

}
