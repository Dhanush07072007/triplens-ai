import { useState } from "react";
import MapView from "./Map.jsx";
import TripPlanner from "./TripPlanner.jsx";
import "./App.css";

/* =========================================================
   15 CITIES × 20 PLACES = 300 PLACES
   ========================================================= */

const cityPlaces = {
  Bengaluru: [
    "Bengaluru Palace",
    "Lalbagh Botanical Garden",
    "Cubbon Park",
    "Vidhana Soudha",
    "ISKCON Temple Bengaluru",
    "Bannerghatta Biological Park",
    "Ulsoor Lake",
    "Nandi Hills",
    "Tipu Sultan's Summer Palace",
    "National Gallery of Modern Art",
    "HAL Heritage Centre",
    "Visvesvaraya Industrial Museum",
    "Wonderla Bengaluru",
    "Commercial Street",
    "KR Market",
    "Bangalore Fort",
    "Jawaharlal Nehru Planetarium",
    "Bugle Rock Park",
    "Freedom Park",
    "VV Puram Food Street",
  ],

  Mysuru: [
    "Mysore Palace",
    "Brindavan Gardens",
    "Mysore Zoo",
    "Chamundi Hill",
    "St Philomena's Cathedral",
    "Karanji Lake",
    "Jaganmohan Palace",
    "Devaraja Market",
    "Railway Museum Mysuru",
    "Lalitha Mahal Palace",
    "Ranganathittu Bird Sanctuary",
    "Kukkarahalli Lake",
    "Regional Museum of Natural History",
    "GRS Fantasy Park",
    "Krishna Raja Sagara Dam",
    "Cheluvamba Park",
    "Folklore Museum",
    "Kishkindha Moolika Bonsai Garden",
    "Sand Sculpture Museum",
    "Mysuru Wax Museum",
  ],

  Goa: [
    "Baga Beach",
    "Calangute Beach",
    "Anjuna Beach",
    "Candolim Beach",
    "Palolem Beach",
    "Colva Beach",
    "Fort Aguada",
    "Basilica of Bom Jesus",
    "Se Cathedral",
    "Dudhsagar Falls",
    "Chapora Fort",
    "Vagator Beach",
    "Miramar Beach",
    "Dona Paula",
    "Fontainhas",
    "Reis Magos Fort",
    "Salim Ali Bird Sanctuary",
    "Spice Plantation",
    "Aguada Lighthouse",
    "Arpora Saturday Night Market",
  ],

  Mumbai: [
    "Gateway of India",
    "Marine Drive",
    "Chhatrapati Shivaji Maharaj Terminus",
    "Elephanta Caves",
    "Siddhivinayak Temple",
    "Juhu Beach",
    "Colaba Causeway",
    "Haji Ali Dargah",
    "Sanjay Gandhi National Park",
    "Bandra-Worli Sea Link",
    "Bandra Fort",
    "Kanheri Caves",
    "Chowpatty Beach",
    "Nehru Planetarium",
    "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    "Dr Bhau Daji Lad Museum",
    "Hanging Gardens",
    "Global Vipassana Pagoda",
    "Powai Lake",
    "Crawford Market",
  ],

  Delhi: [
    "India Gate",
    "Red Fort",
    "Qutub Minar",
    "Humayun's Tomb",
    "Lotus Temple",
    "Akshardham Temple",
    "Jama Masjid",
    "Chandni Chowk",
    "Lodhi Garden",
    "Rashtrapati Bhavan",
    "National Museum",
    "Gurudwara Bangla Sahib",
    "Jantar Mantar",
    "Purana Qila",
    "Raj Ghat",
    "Dilli Haat",
    "National Zoological Park",
    "Agrasen ki Baoli",
    "Sunder Nursery",
    "Connaught Place",
  ],

  Jaipur: [
    "Amber Fort",
    "City Palace Jaipur",
    "Hawa Mahal",
    "Jantar Mantar Jaipur",
    "Jal Mahal",
    "Nahargarh Fort",
    "Jaigarh Fort",
    "Albert Hall Museum",
    "Birla Mandir Jaipur",
    "Galtaji Temple",
    "Patrika Gate",
    "Nahargarh Biological Park",
    "Chokhi Dhani",
    "Johari Bazaar",
    "Bapu Bazaar",
    "Central Park Jaipur",
    "Sisodia Rani Garden",
    "Panna Meena ka Kund",
    "Anokhi Museum",
    "Jaipur Wax Museum",
  ],

  Hyderabad: [
    "Charminar",
    "Golconda Fort",
    "Hussain Sagar Lake",
    "Salar Jung Museum",
    "Chowmahalla Palace",
    "Qutb Shahi Tombs",
    "Birla Mandir Hyderabad",
    "Ramoji Film City",
    "Nehru Zoological Park",
    "Lumbini Park",
    "Shilparamam",
    "Durgam Cheruvu",
    "Mecca Masjid",
    "Purani Haveli",
    "Laad Bazaar",
    "NTR Gardens",
    "Statue of Equality",
    "Osman Sagar Lake",
    "Taramati Baradari",
    "KBR National Park",
  ],

  Chennai: [
    "Marina Beach",
    "Kapaleeshwarar Temple",
    "Fort St George",
    "Government Museum Chennai",
    "San Thome Basilica",
    "Guindy National Park",
    "Elliot's Beach",
    "Valluvar Kottam",
    "Arignar Anna Zoological Park",
    "DakshinaChitra",
    "Mahabalipuram",
    "Shore Temple",
    "Semmozhi Poonga",
    "Birla Planetarium Chennai",
    "MGR Marina",
    "Cholamandal Artists' Village",
    "Besant Nagar Beach",
    "National Art Gallery Chennai",
    "Thousand Lights Mosque",
    "Theosophical Society",
  ],

  Kolkata: [
    "Victoria Memorial",
    "Howrah Bridge",
    "Indian Museum",
    "St Paul's Cathedral",
    "Dakshineswar Kali Temple",
    "Belur Math",
    "Marble Palace",
    "Park Street",
    "Prinsep Ghat",
    "Eco Park Kolkata",
    "Science City Kolkata",
    "Birla Planetarium Kolkata",
    "Kalighat Temple",
    "Mother House",
    "Maidan",
    "New Market",
    "Nicco Park",
    "Rabindra Sarobar",
    "Kumartuli",
    "Alipore Zoo",
  ],

  Agra: [
    "Taj Mahal",
    "Agra Fort",
    "Fatehpur Sikri",
    "Mehtab Bagh",
    "Itmad-ud-Daulah's Tomb",
    "Akbar's Tomb",
    "Mariam-uz-Zamani Tomb",
    "Agra Bear Rescue Facility",
    "Jama Masjid Agra",
    "Mankameshwar Temple",
    "Kinari Bazaar",
    "Sikandra",
    "Anguri Bagh",
    "Tomb of Salim Chishti",
    "Panch Mahal",
    "Buland Darwaza",
    "Keetham Lake",
    "Agra Heritage Walk",
    "Ram Bagh",
    "Chini ka Rauza",
  ],

  Varanasi: [
    "Kashi Vishwanath Temple",
    "Dashashwamedh Ghat",
    "Assi Ghat",
    "Sarnath",
    "Manikarnika Ghat",
    "Sankat Mochan Temple",
    "BHU Vishwanath Temple",
    "Ramnagar Fort",
    "Tulsi Manas Temple",
    "Durga Temple",
    "Kaal Bhairav Temple",
    "Banaras Hindu University",
    "Ganga Aarti",
    "Man Mandir Ghat",
    "Scindia Ghat",
    "Ramnagar Museum",
    "Bharat Mata Temple",
    "Nepali Temple",
    "Alamgir Mosque",
    "Godowlia Market",
  ],

  Udaipur: [
    "City Palace Udaipur",
    "Lake Pichola",
    "Jag Mandir",
    "Sajjangarh Palace",
    "Jagdish Temple",
    "Fateh Sagar Lake",
    "Saheliyon-ki-Bari",
    "Bagore Ki Haveli",
    "Vintage and Classic Car Museum",
    "Doodh Talai",
    "Gulab Bagh",
    "Bharatiya Lok Kala Mandal",
    "Monsoon Palace",
    "Badi Lake",
    "Shilpgram",
    "Ahar Cenotaphs",
    "Karni Mata Temple Udaipur",
    "Ambrai Ghat",
    "Moti Magri",
    "Neemach Mata Temple",
  ],

  Amritsar: [
    "Golden Temple",
    "Jallianwala Bagh",
    "Wagah Border",
    "Partition Museum",
    "Akal Takht",
    "Durgiana Temple",
    "Gobindgarh Fort",
    "Heritage Street",
    "Maharaja Ranjit Singh Museum",
    "Ram Tirath",
    "Pul Kanjari",
    "Hall Bazaar",
    "Khair-ud-Din Masjid",
    "Company Bagh",
    "Sadda Pind",
    "Central Sikh Museum",
    "Gurudwara Baba Atal Rai",
    "Saragarhi Memorial",
    "Maharaja Ranjit Singh Panorama",
    "Amritsar Food Street",
  ],

  Rishikesh: [
    "Laxman Jhula",
    "Ram Jhula",
    "Triveni Ghat",
    "Beatles Ashram",
    "Neer Garh Waterfall",
    "Rajaji National Park",
    "Parmarth Niketan",
    "Neelkanth Mahadev Temple",
    "Ganga Beach",
    "Swarg Ashram",
    "Bungee Jumping Rishikesh",
    "River Rafting Rishikesh",
    "Kunjapuri Temple",
    "Vashishta Cave",
    "Patna Waterfall",
    "Tera Manzil Temple",
    "Sivananda Ashram",
    "Geeta Bhawan",
    "Muni Ki Reti",
    "Garud Chatti Waterfall",
  ],

  Ahmedabad: [
    "Sabarmati Ashram",
    "Kankaria Lake",
    "Adalaj Stepwell",
    "Sidi Saiyyed Mosque",
    "Jama Masjid Ahmedabad",
    "Sabarmati Riverfront",
    "Science City Ahmedabad",
    "Calico Museum of Textiles",
    "Hutheesing Jain Temple",
    "Sarkhej Roza",
    "Auto World Vintage Car Museum",
    "Law Garden",
    "Manek Chowk",
    "Teen Darwaza",
    "Bhadra Fort",
    "Jhulta Minar",
    "Vechaar Utensils Museum",
    "Gujarat Science City",
    "Sardar Vallabhbhai Patel Museum",
    "Riverfront Flower Park",
  ],
};

/* =========================================================
   CITY COORDINATES
   ========================================================= */

const cityCoordinates = {
  Bengaluru: [12.9716, 77.5946],
  Mysuru: [12.2958, 76.6394],
  Goa: [15.4909, 73.8278],
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Jaipur: [26.9124, 75.7873],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Agra: [27.1767, 78.0081],
  Varanasi: [25.3176, 82.9739],
  Udaipur: [24.5854, 73.7125],
  Amritsar: [31.634, 74.8723],
  Rishikesh: [30.0869, 78.2676],
  Ahmedabad: [23.0225, 72.5714],
};

/* =========================================================
   CATEGORY DETECTION
   ========================================================= */

function getCategory(placeName, index) {
  const name = placeName.toLowerCase();

  if (
    name.includes("beach") ||
    name.includes("lake") ||
    name.includes("ghat") ||
    name.includes("river") ||
    name.includes("waterfall")
  ) {
    return "Nature";
  }

  if (
    name.includes("fort") ||
    name.includes("palace") ||
    name.includes("museum") ||
    name.includes("temple") ||
    name.includes("mosque") ||
    name.includes("church") ||
    name.includes("cathedral") ||
    name.includes("tomb") ||
    name.includes("memorial") ||
    name.includes("heritage") ||
    name.includes("ashram")
  ) {
    return "History";
  }

  if (
    name.includes("food") ||
    name.includes("market") ||
    name.includes("bazaar") ||
    name.includes("street") ||
    name.includes("chowk")
  ) {
    return "Food";
  }

  if (
    name.includes("bungee") ||
    name.includes("rafting") ||
    name.includes("wonderla") ||
    name.includes("film city")
  ) {
    return "Adventure";
  }

  if (
    name.includes("garden") ||
    name.includes("park") ||
    name.includes("zoo") ||
    name.includes("sanctuary") ||
    name.includes("biological") ||
    name.includes("national park")
  ) {
    return "Nature";
  }

  if (
    name.includes("planetarium") ||
    name.includes("gallery") ||
    name.includes("view") ||
    name.includes("pagoda")
  ) {
    return "Photography";
  }

  const fallback = [
    "History",
    "Nature",
    "Photography",
    "Culture",
    "Food",
  ];

  return fallback[index % fallback.length];
}

/* =========================================================
   DESCRIPTION
   ========================================================= */

function getDescription(placeName, city, category) {
  const descriptions = {
    Nature: `A beautiful ${category.toLowerCase()} destination in ${city}, perfect for relaxing, exploring and taking photographs.`,
    History: `A popular historical and cultural attraction in ${city} with an interesting story and local heritage.`,
    Adventure: `An exciting destination in ${city} for visitors looking for fun, activities and memorable experiences.`,
    Food: `A popular place to experience local food and the unique flavours of ${city}.`,
    Photography: `A scenic destination in ${city} with excellent opportunities for photography and sightseeing.`,
    Culture: `A cultural attraction in ${city} where visitors can experience local traditions and heritage.`,
    Beach: `A popular coastal destination offering beautiful views, relaxing surroundings and photography opportunities.`,
  };

  return (
    descriptions[category] ||
    `A popular destination in ${city} worth exploring during your trip.`
  );
}

/* =========================================================
   CREATE ALL 300 PLACES
   ========================================================= */

const places = Object.entries(cityPlaces).flatMap(
  ([city, cityPlaceNames]) => {
    const [baseLat, baseLng] = cityCoordinates[city];

    return cityPlaceNames.map((name, index) => {
      const category = getCategory(name, index);

      /*
        Small coordinate offsets are used so that the map can
        display the different attractions around the city.
      */
      const latOffset = ((index % 5) - 2) * 0.018;
      const lngOffset =
        (Math.floor(index / 5) - 1.5) * 0.018;

      return {
        id: `${city}-${index + 1}`,
        name,
        city,
        category,
        icon:
          category === "Nature"
            ? "🌳"
            : category === "History"
            ? "🏛️"
            : category === "Food"
            ? "🍴"
            : category === "Adventure"
            ? "🎢"
            : category === "Photography"
            ? "📸"
            : "✨",
        description: getDescription(
          name,
          city,
          category
        ),
        bestTime:
          category === "Food"
            ? "Morning / Evening"
            : category === "Nature"
            ? "Morning / Evening"
            : "Morning / Afternoon",
        rating: (
          4.1 +
          ((index * 7) % 9) / 10
        ).toFixed(1),
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        tags: [
          city,
          category,
          "Tourist Place",
          "India",
        ],
      };
    });
  }
);

/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  "All",
  "Nature",
  "History",
  "Beach",
  "Adventure",
  "Food",
  "Photography",
  "Culture",
];

/* =========================================================
   POPULAR CITIES
   ========================================================= */

const popularCities = [
  "Bengaluru",
  "Mysuru",
  "Goa",
  "Mumbai",
  "Delhi",
  "Jaipur",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Agra",
  "Varanasi",
  "Udaipur",
  "Amritsar",
  "Rishikesh",
  "Ahmedabad",
];

/* =========================================================
   MAIN APP
   ========================================================= */

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedPlace, setSelectedPlace] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [aiResult, setAiResult] =
    useState(null);

  const [aiError, setAiError] =
    useState("");

  /* =====================================================
     FILTER PLACES
     ===================================================== */

  const filteredPlaces = places.filter(
    (place) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        place.name
          .toLowerCase()
          .includes(searchText) ||
        place.city
          .toLowerCase()
          .includes(searchText) ||
        place.category
          .toLowerCase()
          .includes(searchText) ||
        place.tags.some((tag) =>
          tag
            .toLowerCase()
            .includes(searchText)
        );

      const matchesCategory =
        selectedCategory === "All" ||
        place.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  /* =====================================================
     CITY CLICK
     ===================================================== */

  function handleCityClick(city) {
    setSearch(city);
    setSelectedCategory("All");

    setTimeout(() => {
      document
        .getElementById("explore")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }

  /* =====================================================
     DIRECTIONS
     ===================================================== */

  function openDirections(place) {
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${place.lat},${place.lng}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =====================================================
     LOCATION
     ===================================================== */

  function openLocation(place) {
    const url =
      `https://www.google.com/maps/search/?api=1` +
      `&query=${place.lat},${place.lng}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =====================================================
     SELECT PLACE
     ===================================================== */

  function findPlaceOnMap(place) {
    setSelectedPlace(place);

    setTimeout(() => {
      document
        .getElementById("map")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }

  /* =====================================================
     IMAGE CHANGE
     ===================================================== */

  function handleImageChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
    setAiResult(null);
    setAiError("");

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  /* =====================================================
     AI IMAGE ANALYSIS
     ===================================================== */

  async function analyzeImage() {
    if (!selectedImage) {
      setAiError(
        "Please choose an image first."
      );
      return;
    }

    setAnalyzing(true);
    setAiError("");
    setAiResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        selectedImage
      );

      console.log(
        "📸 Sending image to TripLens AI..."
      );

      const response =
        await fetch(
          "http://localhost:5000/api/analyze-image",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "Image analysis failed."
        );
      }

      setAiResult(data);
    } catch (error) {
      console.error(
        "Image analysis error:",
        error
      );

      setAiError(
        error.message ||
          "Could not connect to the TripLens AI backend."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  /* =====================================================
     JSX
     ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
          ================================================= */}

      <header className="navbar">
        <div className="navbar-inner">

          <div
            className="logo"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <div className="logo-icon">
              ✈
            </div>

            <span>
              TripLens AI
            </span>
          </div>

          <nav className="nav-links">
            <a href="#explore">
              Explore
            </a>

            <a href="#map">
              Map
            </a>

            <a href="#ai-discovery">
              AI Discovery
            </a>

            <a href="#trip-planner">
              Trip Planner
            </a>
          </nav>

          <a
            href="#trip-planner"
            className="plan-button"
          >
            Plan a Trip ✨
          </a>

        </div>
      </header>

      {/* =================================================
          HERO
          ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ SMART TRAVEL DISCOVERY
          </div>

          <h1>
            Discover places
            <br />
            <span>
              you'll love.
            </span>
          </h1>

          <p>
            Explore amazing destinations,
            discover hidden gems and let
            TripLens AI help you plan
            unforgettable journeys.
          </p>

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search city, place or experience..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            <button
              onClick={() => {
                document
                  .getElementById(
                    "explore"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  });
              }}
            >
              Explore
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>
                15
              </strong>
              <span>
                Cities
              </span>
            </div>

            <div>
              <strong>
                300+
              </strong>
              <span>
                Places
              </span>
            </div>

            <div>
              <strong>
                AI
              </strong>
              <span>
                Powered
              </span>
            </div>

          </div>

        </div>

        <div className="hero-decoration">
          <div className="travel-card card-one">
            📍
          </div>

          <div className="travel-card card-two">
            ✈️
          </div>

          <div className="travel-card card-three">
            📸
          </div>
        </div>

      </section>

      {/* =================================================
          POPULAR CITIES
          ================================================= */}

      <section className="popular-section">

        <div className="section-container">

          <div className="section-heading">
            <div>
              <span className="section-label">
                POPULAR DESTINATIONS
              </span>

              <h2>
                Where do you want to go?
              </h2>
            </div>

            <p>
              Choose a city and explore
              its best places.
            </p>
          </div>

          <div className="city-buttons">

            {popularCities.map(
              (city) => (
                <button
                  key={city}
                  onClick={() =>
                    handleCityClick(
                      city
                    )
                  }
                  className={
                    search === city
                      ? "active"
                      : ""
                  }
                >
                  {city}
                </button>
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          EXPLORE
          ================================================= */}

      <section
        className="explore-section"
        id="explore"
      >

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Find your next adventure
              </h2>
            </div>

            <p>
              {filteredPlaces.length} places
              found
            </p>

          </div>

          {/* CATEGORY FILTER */}

          <div className="category-buttons">

            {categories.map(
              (category) => (
                <button
                  key={category}
                  className={
                    selectedCategory ===
                    category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  {category}
                </button>
              )
            )}

          </div>

          {/* PLACE CARDS */}

          {filteredPlaces.length >
          0 ? (
            <div className="places-grid">

              {filteredPlaces.map(
                (place) => (
                  <article
                    className="place-card"
                    key={place.id}
                  >

                    <div className="place-image">

                      <div className="place-image-icon">
                        {place.icon}
                      </div>

                      <span className="place-category">
                        {place.category}
                      </span>

                      <span className="place-rating">
                        ⭐ {place.rating}
                      </span>

                    </div>

                    <div className="place-content">

                      <div className="place-location">
                        📍 {place.city}
                      </div>

                      <h3>
                        {place.name}
                      </h3>

                      <p>
                        {place.description}
                      </p>

                      <div className="place-info">

                        <span>
                          🕒{" "}
                          {place.bestTime}
                        </span>

                      </div>

                      <div className="place-actions">

                        <button
                          onClick={() =>
                            findPlaceOnMap(
                              place
                            )
                          }
                        >
                          View on Map
                        </button>

                        <button
                          onClick={() =>
                            openDirections(
                              place
                            )
                          }
                        >
                          Directions
                        </button>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          ) : (
            <div className="no-results">

              <div>
                🔍
              </div>

              <h3>
                No places found
              </h3>

              <p>
                Try another city,
                place or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(
                    "All"
                  );
                }}
              >
                Show all places
              </button>

            </div>
          )}

        </div>

      </section>

      {/* =================================================
          MAP
          ================================================= */}

      <section
        className="map-section"
        id="map"
      >

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                INTERACTIVE MAP
              </span>

              <h2>
                Explore places on the map
              </h2>
            </div>

            <p>
              Click a marker to explore
              a destination.
            </p>

          </div>

          <div className="map-layout">

            <div className="map-wrapper">

              <MapView
                places={
                  filteredPlaces
                }
                selectedPlace={
                  selectedPlace
                }
                onSelectPlace={
                  setSelectedPlace
                }
              />

            </div>

            <div className="map-info">

              {selectedPlace ? (
                <>
                  <div className="selected-icon">
                    {
                      selectedPlace.icon
                    }
                  </div>

                  <span className="section-label">
                    SELECTED PLACE
                  </span>

                  <h3>
                    {
                      selectedPlace.name
                    }
                  </h3>

                  <p className="selected-city">
                    📍{" "}
                    {
                      selectedPlace.city
                    }
                  </p>

                  <p>
                    {
                      selectedPlace.description
                    }
                  </p>

                  <div className="selected-details">

                    <span>
                      ⭐{" "}
                      {
                        selectedPlace.rating
                      }
                    </span>

                    <span>
                      🏷️{" "}
                      {
                        selectedPlace.category
                      }
                    </span>

                  </div>

                  <button
                    className="map-directions"
                    onClick={() =>
                      openDirections(
                        selectedPlace
                      )
                    }
                  >
                    Get Directions →
                  </button>

                </>
              ) : (
                <>

                  <div className="selected-icon">
                    🗺️
                  </div>

                  <span className="section-label">
                    DISCOVER
                  </span>

                  <h3>
                    Select a place
                  </h3>

                  <p>
                    Choose any destination
                    from the cards or click
                    a marker on the map to
                    see more details.
                  </p>

                </>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          AI DISCOVERY
          ================================================= */}

      <section
        className="ai-section"
        id="ai-discovery"
      >

        <div className="ai-header">

          <div className="ai-icon">
            🤖
          </div>

          <div>

            <p className="section-label">
              AI DISCOVERY
            </p>

            <h2>
              Upload a photo.
              <br />
              Discover your next trip.
            </h2>

            <p>
              Let TripLens AI analyze
              your travel photo and
              suggest similar places.
            </p>

          </div>

        </div>

        <div className="ai-upload-box">

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          {imagePreview && (
            <div className="image-preview">

              <img
                src={imagePreview}
                alt="Selected travel"
              />

            </div>
          )}

          <button
            className="ai-button"
            onClick={
              analyzeImage
            }
            disabled={analyzing}
          >
            {analyzing
              ? "✨ Analyzing..."
              : "✨ Analyze My Photo"}
          </button>

          {aiError && (
            <p className="ai-error">
              {aiError}
            </p>
          )}

        </div>

        {aiResult && (
          <div className="ai-result">

            <span className="section-label">
              AI RESULT
            </span>

            <h3>
              {aiResult.placeType}
            </h3>

            <p>
              {aiResult.description}
            </p>

            <h4>
              Suggested destinations
            </h4>

            <div className="ai-recommendations">

              {(
                aiResult.suggestedPlaces ||
                []
              ).map(
                (
                  recommendation,
                  index
                ) => (
                  <div
                    className="ai-recommendation-card"
                    key={index}
                  >

                    <div className="recommendation-number">
                      {index + 1}
                    </div>

                    <h4>
                      {
                        recommendation.name
                      }
                    </h4>

                    <p>
                      {
                        recommendation.reason
                      }
                    </p>

                    <button
                      onClick={() => {
                        setSearch(
                          recommendation.name
                        );

                        document
                          .getElementById(
                            "explore"
                          )
                          ?.scrollIntoView({
                            behavior:
                              "smooth",
                          });
                      }}
                    >
                      Explore →
                    </button>

                  </div>
                )
              )}

            </div>

          </div>
        )}

      </section>

      {/* =================================================
          TRIP PLANNER
          ================================================= */}

      <TripPlanner />

      {/* =================================================
          FOOTER
          ================================================= */}

      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-logo">

            <div className="logo-icon">
              ✈
            </div>

            <div>
              <strong>
                TripLens AI
              </strong>

              <p>
                Discover. Explore.
                Experience.
              </p>
            </div>

          </div>

          <div className="footer-links">

            <a href="#explore">
              Explore
            </a>

            <a href="#map">
              Map
            </a>

            <a href="#ai-discovery">
              AI Discovery
            </a>

            <a href="#trip-planner">
              Trip Planner
            </a>

          </div>

          <p className="copyright">
            © 2026 TripLens AI.
            Built for smarter travel.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;