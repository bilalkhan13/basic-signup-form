import { useState, useEffect } from "react";
import "../css/form.css";

export default function Form() {
  const [accessToken, setAccessToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://www.universal-tutorial.com/api/getaccesstoken", {
      headers: {
        Accept: "application/json",
        "api-token":
          "sTAjZuk68p2AmjYfyx6T-F964Tut00m5f8YbUvKl5cUKwcO6FO16UMzxZSop5r7c92M",
        "user-email": "raulrivas.works@gmail.com",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAccessToken(data.auth_token);
        if (!localStorage.getItem("contriesList")) {
          fetchCountries();
          async function fetchCountries() {
            try {
              const response = await fetch(
                "https://www.universal-tutorial.com/api/countries/",
                {
                  headers: {
                    Authorization: `Bearer ${data.auth_token}`,
                    Accept: "application/json",
                  },
                }
              );
              const jsonData = await response.json();
              localStorage.setItem("contriesList", JSON.stringify(jsonData));
              setCountryList(jsonData);
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          setCountryList(JSON.parse(localStorage.getItem("contriesList")));
        }
      })
      .catch((error) => console.error(error));
  }, []);

  function changeCountry(event) {
    setSelectedCountry(event.target.value);
    fetchStates();
    async function fetchStates() {
      try {
        const response = await fetch(
          `https://www.universal-tutorial.com/api/states/${event.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        const jsonData = await response.json();
        setStatesList(jsonData);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function changeState(event) {
    setSelectedState(event.target.value);
    fetchCities();

    async function fetchCities() {
      try {
        const response = await fetch(
          `https://www.universal-tutorial.com/api/cities/${event.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        const jsonData = await response.json();
        setCitiesList(jsonData);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function changeCity(event) {
    setSelectedCity(event.target.value);
  }

  function isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      firstName &&
      lastName &&
      selectedCountry &&
      selectedState &&
      selectedCity &&
      email &&
      isEmailValid &&
      password
    ) {
      const formData = {
        firstName,
        lastName,
        createdAt: new Date(),
        selectedCity,
        selectedState,
        selectedCountry,
        email,
        password,
      };
      alert(JSON.stringify(formData));
      window.location.reload();
    } else {
      alert("Data should be valid.");
    }
  }

  return (
    <>
      <div id="signup">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up for Free</h1>
          <div className="name-row">
            <div className="field-wrap">
              <label>
                First Name <span className="req">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <div className="field-wrap">
              <label>
                Last Name<span className="req">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="field-wrap">
            <label>
              Email Address<span className="req">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field-wrap">
            <label>
              Set a Password<span className="req">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field-wrap">
            <label>
              Country<span className="req">*</span>
            </label>
            <div>
              <select value={selectedCountry} onChange={changeCountry} required>
                <option value="">Select a Country</option>
                {Array.isArray(countryList) &&
                  countryList?.map((val, index) => (
                    <option key={index} value={val?.country_name}>
                      {val?.country_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="field-wrap">
            <label>
              State<span className="req">*</span>
            </label>
            <div>
              <select value={selectedState} onChange={changeState} required>
                <option value="">Select a State</option>
                {statesList?.map((val, index) => (
                  <option key={index} value={val?.state_name}>
                    {val?.state_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-wrap">
            <label>
              City<span className="req">*</span>
            </label>
            <select
              placeholder="Select City"
              value={selectedCity}
              onChange={changeCity}
              required
            >
              <option value="">Select a City</option>
              {citiesList.length > 0
                ? citiesList?.map((val, index) => (
                    <option key={index} value={val?.city_name}>
                      {val?.city_name}
                    </option>
                  ))
                : selectedState && <option value="">No City Found!</option>}
            </select>
          </div>
          <button type="submit" className="button button-block">
            Get Started
          </button>
        </form>
      </div>
    </>
  );
}
