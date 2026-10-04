import { useState } from "react";
import "./TripPlanner.css";

const interestOptions = [
  "Food",
  "History",
  "Nature",
  "Adventure",
  "Photography",
  "Shopping",
  "Culture",
  "Beaches",
];

export default function TripPlanner() {
  const [destination, setDestination] =
    useState("");

  const [budget, setBudget] =
    useState("5000");

  const [days, setDays] =
    useState("2");

  const [people, setPeople] =
    useState("2");

  const [interests, setInterests] =
    useState([
      "Food",
      "History",
    ]);

  const [itinerary, setItinerary] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter(
            (item) => item !== interest
          )
        : [...current, interest]
    );
  }

  async function generateItinerary(event) {
    event.preventDefault();

    setError("");
    setItinerary(null);

    if (!destination.trim()) {
      setError(
        "Please enter a destination."
      );
      return;
    }

    if (interests.length === 0) {
      setError(
        "Please select at least one interest."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-itinerary",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            destination:
              destination.trim(),

            budget: Number(budget),

            days: Number(days),

            people: Number(people),

            interests,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Itinerary generation failed."
        );
      }

      setItinerary(data);
    } catch (err) {
      console.error(
        "Itinerary error:",
        err
      );

      setError(
        err.message ||
          "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetPlanner() {
    setItinerary(null);
    setError("");
  }

  return (
    <section
      className="planner-section"
      id="trip-planner"
    >

      {/* HEADER */}

      <div className="planner-heading">

        <span className="planner-kicker">
          VERSION 5 · AI WEATHER SMART PLANNER
        </span>

        <h2>
          Plan your perfect trip
          with live weather 🌦️
        </h2>

        <p>
          Tell TripLens AI where you want
          to go, your budget, interests and
          trip duration. It checks the
          weather and creates a smarter
          itinerary.
        </p>

      </div>

      {/* FORM */}

      <form
        className="planner-form"
        onSubmit={generateItinerary}
      >

        <div className="planner-fields">

          <label className="planner-field">

            <span>
              📍 Destination
            </span>

            <input
              type="text"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
              placeholder="e.g. Bengaluru, Mysuru, Goa"
              required
            />

          </label>

          <label className="planner-field">

            <span>
              💰 Total budget (₹)
            </span>

            <input
              type="number"
              min="1"
              value={budget}
              onChange={(event) =>
                setBudget(
                  event.target.value
                )
              }
              required
            />

          </label>

          <label className="planner-field">

            <span>
              📅 Number of days
            </span>

            <select
              value={days}
              onChange={(event) =>
                setDays(
                  event.target.value
                )
              }
            >
              {Array.from(
                {
                  length: 14,
                },
                (_, index) =>
                  index + 1
              ).map((day) => (
                <option
                  key={day}
                  value={day}
                >
                  {day}{" "}
                  {day === 1
                    ? "day"
                    : "days"}
                </option>
              ))}
            </select>

          </label>

          <label className="planner-field">

            <span>
              👥 Number of travelers
            </span>

            <input
              type="number"
              min="1"
              max="20"
              value={people}
              onChange={(event) =>
                setPeople(
                  event.target.value
                )
              }
              required
            />

          </label>

        </div>

        {/* INTERESTS */}

        <div className="interest-area">

          <h3>
            ❤️ What are you interested in?
          </h3>

          <p>
            Select one or more interests.
          </p>

          <div className="interest-options">

            {interestOptions.map(
              (interest) => (
                <label
                  key={interest}
                  className={`interest-chip ${
                    interests.includes(
                      interest
                    )
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="checkbox"
                    checked={interests.includes(
                      interest
                    )}
                    onChange={() =>
                      toggleInterest(
                        interest
                      )
                    }
                  />

                  {interest}

                </label>
              )
            )}

          </div>

        </div>

        {/* BUTTON */}

        <button
          className="generate-trip-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "🌦️ Checking weather..."
            : "✨ Generate My Smart Trip"}
        </button>

        {error && (
          <p className="planner-error">
            {error}
          </p>
        )}

      </form>

      {/* RESULT */}

      {itinerary && (

        <div className="itinerary-result">

          {/* WEATHER */}

          {itinerary.weather?.available &&
            itinerary.weather.current && (

              <div className="weather-card">

                <div className="weather-heading">

                  <div>

                    <span className="weather-label">
                      LIVE WEATHER
                    </span>

                    <h3>
                      {itinerary.weather.location?.name}
                    </h3>

                    <p>
                      {
                        itinerary.weather.location
                          ?.country
                      }
                    </p>

                  </div>

                  <div className="weather-icon">
                    {
                      itinerary.weather
                        .current.icon
                    }
                  </div>

                </div>

                <div className="weather-main">

                  <strong>
                    {
                      itinerary.weather
                        .current
                        .temperature
                    }
                    °C
                  </strong>

                  <span>
                    {
                      itinerary.weather
                        .current
                        .condition
                    }
                  </span>

                </div>

                <div className="weather-details">

                  <div>

                    <span>
                      🌧️ Rain
                    </span>

                    <strong>
                      {
                        itinerary.weather
                          .current
                          .rain ?? 0
                      }{" "}
                      mm
                    </strong>

                  </div>

                  <div>

                    <span>
                      📍 Location
                    </span>

                    <strong>
                      {
                        itinerary.weather
                          .location
                          ?.name
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      🕐 Timezone
                    </span>

                    <strong>
                      {
                        itinerary.weather
                          .timezone ||
                        "Local time"
                      }
                    </strong>

                  </div>

                </div>

              </div>

            )}

          {/* WEATHER UNAVAILABLE */}

          {itinerary.weather &&
            !itinerary.weather
              .available && (

              <div className="weather-unavailable">

                🌦️ Weather information could
                not be retrieved. The itinerary
                was still generated.

              </div>

            )}

          {/* TITLE */}

          <div className="itinerary-top">

            <span className="result-label">
              YOUR AI-GENERATED SMART PLAN
            </span>

            <h2>
              {itinerary.title}
            </h2>

            <p>
              {itinerary.summary}
            </p>

          </div>

          {/* BUDGET */}

          <div className="budget-summary">

            <div>

              <span>
                Estimated total
              </span>

              <strong>
                ₹
                {Number(
                  itinerary
                    .estimatedTotal ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div>

              <span>
                Your budget
              </span>

              <strong>
                ₹
                {Number(
                  budget
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {itinerary.budgetNote && (
            <p className="budget-note">
              {itinerary.budgetNote}
            </p>
          )}

          {/* WEATHER SUMMARY */}

          {itinerary.weatherSummary && (

            <div className="weather-summary">

              <strong>
                🌦️ Weather-aware planning
              </strong>

              <p>
                {itinerary.weatherSummary}
              </p>

            </div>

          )}

          {/* DAYS */}

          {(itinerary.days || []).map(
            (day, index) => (

              <section
                className="itinerary-day"
                key={`${day.day}-${index}`}
              >

                <div className="day-heading">

                  <h3>
                    Day {day.day}:{" "}
                    {day.theme}
                  </h3>

                  {day.weather && (

                    <div className="day-weather">

                      <span className="day-weather-icon">
                        {day.weather.icon}
                      </span>

                      <div>

                        <strong>
                          {
                            day.weather
                              .condition
                          }
                        </strong>

                        <small>
                          {
                            day.weather
                              .temperature
                          }
                        </small>

                        <small>
                          ☔{" "}
                          {
                            day.weather
                              .rainProbability ??
                            0
                          }
                          % rain
                        </small>

                      </div>

                    </div>

                  )}

                </div>

                <div className="activity-list">

                  {(day.activities || []).map(
                    (
                      activity,
                      activityIndex
                    ) => (

                      <article
                        className="activity-card"
                        key={`${activity.place}-${activityIndex}`}
                      >

                        <div className="activity-time">
                          {activity.time}
                        </div>

                        <div className="activity-details">

                          <h4>
                            {activity.place}
                          </h4>

                          <p>
                            {
                              activity.description
                            }
                          </p>

                          {activity.weatherReason && (

                            <div className="weather-reason">
                              🌦️{" "}
                              {
                                activity.weatherReason
                              }
                            </div>

                          )}

                          <span className="activity-cost">
                            Approx. ₹
                            {Number(
                              activity
                                .estimatedCost ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </section>

            )
          )}

          {/* MONEY TIPS */}

          {Array.isArray(
            itinerary.moneyTips
          ) &&
            itinerary.moneyTips.length >
              0 && (

              <div className="money-tips">

                <h3>
                  💡 Money-saving tips
                </h3>

                <ul>

                  {itinerary.moneyTips.map(
                    (tip, index) => (
                      <li key={index}>
                        {tip}
                      </li>
                    )
                  )}

                </ul>

              </div>

            )}

          <button
            className="planner-reset-button"
            type="button"
            onClick={resetPlanner}
          >
            Create another itinerary
          </button>

          <p className="planner-disclaimer">
            Weather information can change.
            AI-generated costs and schedules
            are estimates, not booking
            information. Check weather,
            opening hours and prices before
            traveling.
          </p>

        </div>

      )}

    </section>
  );
}