# Documentation de l'API d'authentification - École Islah

Cette documentation explique comment utiliser le système d'authentification JWT de l'API de l'École Islah. Elle inclut des exemples dans plusieurs langages de programmation pour faciliter l'intégration.

## Introduction à l'authentification JWT

L'API utilise JSON Web Tokens (JWT) pour l'authentification. Le processus se déroule en trois étapes:

1. **Authentification**: L'utilisateur fournit ses identifiants pour obtenir un token d'accès et un token de rafraîchissement.
2. **Autorisation**: Le token d'accès est inclus dans les en-têtes des requêtes pour accéder aux ressources protégées.
3. **Rafraîchissement**: Lorsque le token d'accès expire, le token de rafraîchissement est utilisé pour obtenir un nouveau token d'accès.


## Endpoints d'authentification

### 1. Connexion

Permet d'obtenir un token d'accès et un token de rafraîchissement en fournissant les identifiants.

**Endpoint**: `POST /auth/login`

**Corps de la requête**:

```json
{
  "username": "votre_nom_utilisateur",
  "password": "votre_mot_de_passe"
}
```

**Réponse**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 2. Rafraîchissement du token

Permet d'obtenir un nouveau token d'accès en utilisant le token de rafraîchissement.

**Endpoint**: `POST /auth/refresh`

**Corps de la requête**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Informations sur l'utilisateur connecté

Permet d'obtenir les informations de l'utilisateur actuellement connecté.

**Endpoint**: `GET /users/me`

**En-têtes**:

```plaintext
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse**:

```json
{
  "id_user": 1,
  "username": "admin",
  "email": "admin@islah.org",
  "nom": "Administrateur",
  "prenom": "Système",
  "role": "admin",
  "est_actif": true,
  "created_at": "2023-05-15T10:30:00",
  "updated_at": "2023-05-15T10:30:00"
}
```

## Exemples d'utilisation dans différents langages

### JavaScript (Fetch API)

```javascript
// Connexion et obtention des tokens
async function login(username, password) {
  try {
    const response = await fetch('https://api.ecole-islah.org/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Échec de la connexion');
    }
    
    const data = await response.json();
    
    // Stocker les tokens
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    return true;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}

// Requête authentifiée
async function fetchUserProfile() {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch('https://api.ecole-islah.org/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (response.status === 401) {
      // Token expiré, essayer de le rafraîchir
      const refreshed = await refreshToken();
      if (refreshed) {
        return fetchUserProfile();
      } else {
        throw new Error('Session expirée');
      }
    }
    
    if (!response.ok) {
      throw new Error('Échec de la requête');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Rafraîchissement du token
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('https://api.ecole-islah.org/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    return true;
  } catch (error) {
    console.error('Erreur de rafraîchissement:', error);
    return false;
  }
}
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

// Créer une instance axios avec l'URL de base
const api = axios.create({
  baseURL: 'https://api.ecole-islah.org',
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('https://api.ecole-islah.org/auth/refresh', {
          refresh_token: refreshToken,
        });
        
        const { access_token, refresh_token } = response.data;
        
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        
        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        // Rediriger vers la page de connexion
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonctions d'API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { access_token, refresh_token } = response.data;
    
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    return response.data;
  },
  
  getUserProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
```

### Python (Requests)

```python
import requests

class IslamSchoolAPI:
    def __init__(self, base_url="https://api.ecole-islah.org"):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
        self.session = requests.Session()
    
    def login(self, username, password):
        """Authentification et obtention des tokens."""
        url = f"{self.base_url}/auth/login"
        data = {
            "username": username,
            "password": password
        }
        
        response = self.session.post(url, json=data)
        response.raise_for_status()  # Lève une exception si la requête échoue
        
        tokens = response.json()
        self.access_token = tokens["access_token"]
        self.refresh_token = tokens["refresh_token"]
        
        # Configurer l'en-tête d'autorisation pour les futures requêtes
        self.session.headers.update({
            "Authorization": f"Bearer {self.access_token}"
        })
        
        return tokens
    
    def refresh(self):
        """Rafraîchir le token d'accès."""
        url = f"{self.base_url}/auth/refresh"
        data = {
            "refresh_token": self.refresh_token
        }
        
        response = self.session.post(url, json=data)
        response.raise_for_status()
        
        tokens = response.json()
        self.access_token = tokens["access_token"]
        self.refresh_token = tokens["refresh_token"]
        
        # Mettre à jour l'en-tête d'autorisation
        self.session.headers.update({
            "Authorization": f"Bearer {self.access_token}"
        })
        
        return tokens
    
    def get_user_profile(self):
        """Obtenir le profil de l'utilisateur connecté."""
        url = f"{self.base_url}/users/me"
        
        try:
            response = self.session.get(url)
            
            # Si le token est expiré, essayer de le rafraîchir
            if response.status_code == 401:
                self.refresh()
                response = self.session.get(url)
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la récupération du profil: {e}")
            raise

# Exemple d'utilisation
if __name__ == "__main__":
    api = IslamSchoolAPI()
    
    try:
        # Connexion
        api.login("admin", "motdepasse123")
        
        # Récupération du profil
        profile = api.get_user_profile()
        print(f"Connecté en tant que: {profile['prenom']} {profile['nom']}")
        
        # Autres opérations...
        
    except Exception as e:
        print(f"Erreur: {e}")
```

### PHP (cURL)

```php
<?php

class IslamSchoolAPI {
    private $baseUrl;
    private $accessToken;
    private $refreshToken;
    
    public function __construct($baseUrl = 'https://api.ecole-islah.org') {
        $this->baseUrl = $baseUrl;
        
        // Récupérer les tokens depuis la session si disponibles
        if (isset($_SESSION['access_token'])) {
            $this->accessToken = $_SESSION['access_token'];
        }
        
        if (isset($_SESSION['refresh_token'])) {
            $this->refreshToken = $_SESSION['refresh_token'];
        }
    }
    
    public function login($username, $password) {
        $url = $this->baseUrl . '/auth/login';
        $data = [
            'username' => $username,
            'password' => $password
        ];
        
        $response = $this->makeRequest('POST', $url, $data);
        
        if (isset($response['access_token']) && isset($response['refresh_token'])) {
            $this->accessToken = $response['access_token'];
            $this->refreshToken = $response['refresh_token'];
            
            // Stocker les tokens dans la session
            $_SESSION['access_token'] = $this->accessToken;
            $_SESSION['refresh_token'] = $this->refreshToken;
        }
        
        return $response;
    }
    
    public function refresh() {
        if (!$this->refreshToken) {
            throw new Exception('Aucun token de rafraîchissement disponible');
        }
        
        $url = $this->baseUrl . '/auth/refresh';
        $data = [
            'refresh_token' => $this->refreshToken
        ];
        
        $response = $this->makeRequest('POST', $url, $data);
        
        if (isset($response['access_token']) && isset($response['refresh_token'])) {
            $this->accessToken = $response['access_token'];
            $this->refreshToken = $response['refresh_token'];
            
            // Mettre à jour les tokens dans la session
            $_SESSION['access_token'] = $this->accessToken;
            $_SESSION['refresh_token'] = $this->refreshToken;
        }
        
        return $response;
    }
    
    public function getUserProfile() {
        $url = $this->baseUrl . '/users/me';
        
        try {
            $response = $this->makeRequest('GET', $url);
            return $response;
        } catch (Exception $e) {
            // Si le token est expiré, essayer de le rafraîchir
            if (strpos($e->getMessage(), '401') !== false) {
                $this->refresh();
                return $this->makeRequest('GET', $url);
            }
            
            throw $e;
        }
    }
    
    private function makeRequest($method, $url, $data = null) {
        $ch = curl_init();
        
        $headers = ['Content-Type: application/json'];
        
        // Ajouter le token d'accès si disponible
        if ($this->accessToken) {
            $headers[] = 'Authorization: Bearer ' . $this->accessToken;
        }
        
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => $method
        ];
        
        // Ajouter les données pour les requêtes POST/PUT
        if ($data && ($method === 'POST' || $method === 'PUT')) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }
        
        curl_setopt_array($ch, $options);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new Exception(curl_error($ch));
        }
        
        curl_close($ch);
        
        $responseData = json_decode($response, true);
        
        if ($httpCode >= 400) {
            $errorMessage = isset($responseData['detail']) ? $responseData['detail'] : 'Erreur inconnue';
            throw new Exception("Erreur HTTP $httpCode: $errorMessage");
        }
        
        return $responseData;
    }
    
    public function logout() {
        // Supprimer les tokens
        $this->accessToken = null;
        $this->refreshToken = null;
        
        // Supprimer les tokens de la session
        unset($_SESSION['access_token']);
        unset($_SESSION['refresh_token']);
    }
}

// Exemple d'utilisation
session_start();

$api = new IslamSchoolAPI();

try {
    // Connexion
    $api->login('admin', 'motdepasse123');
    
    // Récupération du profil
    $profile = $api->getUserProfile();
    echo "Connecté en tant que: {$profile['prenom']} {$profile['nom']}";
    
    // Autres opérations...
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage();
}
```

### Java (OkHttp)

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import okhttp3.*;
import java.io.IOException;

public class IslamSchoolAPI {
    private final String baseUrl;
    private String accessToken;
    private String refreshToken;
    private final OkHttpClient client;
    private final Gson gson;
    
    public IslamSchoolAPI(String baseUrl) {
        this.baseUrl = baseUrl;
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }
    
    public boolean login(String username, String password) throws IOException {
        JsonObject jsonBody = new JsonObject();
        jsonBody.addProperty("username", username);
        jsonBody.addProperty("password", password);
        
        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"), 
            jsonBody.toString()
        );
        
        Request request = new Request.Builder()
            .url(baseUrl + "/auth/login")
            .post(body)
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return false;
            }
            
            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            
            this.accessToken = jsonResponse.get("access_token").getAsString();
            this.refreshToken = jsonResponse.get("refresh_token").getAsString();
            
            return true;
        }
    }
    
    public boolean refreshToken() throws IOException {
        if (refreshToken == null) {
            return false;
        }
        
        JsonObject jsonBody = new JsonObject();
        jsonBody.addProperty("refresh_token", refreshToken);
        
        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"), 
            jsonBody.toString()
        );
        
        Request request = new Request.Builder()
            .url(baseUrl + "/auth/refresh")
            .post(body)
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return false;
            }
            
            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            
            this.accessToken = jsonResponse.get("access_token").getAsString();
            this.refreshToken = jsonResponse.get("refresh_token").getAsString();
            
            return true;
        }
    }
    
    public JsonObject getUserProfile() throws IOException {
        Request request = new Request.Builder()
            .url(baseUrl + "/users/me")
            .header("Authorization", "Bearer " + accessToken)
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (response.code() == 401) {
                // Token expiré, essayer de le rafraîchir
                if (refreshToken()) {
                    return getUserProfile();
                } else {
                    throw new IOException("Session expirée");
                }
            }
            
            if (!response.isSuccessful()) {
                throw new IOException("Erreur HTTP: " + response.code());
            }
            
            String responseBody = response.body().string();
            return gson.fromJson(responseBody, JsonObject.class);
        }
    }
    
    public void logout() {
        this.accessToken = null;
        this.refreshToken = null;
    }
    
    // Getters pour les tokens
    public String getAccessToken() {
        return accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    // Setters pour les tokens (utile pour restaurer une session)
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

// Exemple d'utilisation
public class Main {
    public static void main(String[] args) {
        IslamSchoolAPI api = new IslamSchoolAPI("https://api.ecole-islah.org");
        
        try {
            // Connexion
            boolean success = api.login("admin", "motdepasse123");
            
            if (success) {
                // Récupération du profil
                JsonObject profile = api.getUserProfile();
                System.out.println("Connecté en tant que: " + 
                    profile.get("prenom").getAsString() + " " + 
                    profile.get("nom").getAsString());
                
                // Autres opérations...
            } else {
                System.out.println("Échec de la connexion");
            }
        } catch (IOException e) {
            System.out.println("Erreur: " + e.getMessage());
        }
    }
}
```

### C# (.NET)

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace IslamSchoolClient
{
    public class AuthTokens
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string TokenType { get; set; }
    }
    
    public class UserProfile
    {
        public int IdUser { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Role { get; set; }
        public bool EstActif { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class IslamSchoolAPI
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private AuthTokens _tokens;
        
        public IslamSchoolAPI(string baseUrl = "https://api.ecole-islah.org")
        {
            _baseUrl = baseUrl;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }
        
        public async Task<bool> LoginAsync(string username, string password)
        {
            var loginData = new
            {
                username,
                password
            };
            
            var content = new StringContent(
                JsonSerializer.Serialize(loginData),
                Encoding.UTF8,
                "application/json");
            
            var response = await _httpClient.PostAsync($"{_baseUrl}/auth/login", content);
            
            if (!response.IsSuccessStatusCode)
            {
                return false;
            }
            
            var responseContent = await response.Content.ReadAsStringAsync();
            _tokens = JsonSerializer.Deserialize<AuthTokens>(responseContent);
            
            // Configurer l'en-tête d'autorisation pour les futures requêtes
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _tokens.AccessToken);
            
            return true;
        }
        
        public async Task<bool> RefreshTokenAsync()
        {
            if (_tokens?.RefreshToken == null)
            {
                return false;
            }
            
            var refreshData = new
            {
                refresh_token = _tokens.RefreshToken
            };
            
            var content = new StringContent(
                JsonSerializer.Serialize(refreshData),
                Encoding.UTF8,
                "application/json");
            
            var response = await _httpClient.PostAsync($"{_baseUrl}/auth/refresh", content);
            
            if (!response.IsSuccessStatusCode)
            {
                return false;
            }
            
            var responseContent = await response.Content.ReadAsStringAsync();
            _tokens = JsonSerializer.Deserialize<AuthTokens>(responseContent);
            
            // Mettre à jour l'en-tête d'autorisation
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _tokens.AccessToken);
            
            return true;
        }
        
        public async Task<UserProfile> GetUserProfileAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/users/me");
            
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                // Token expiré, essayer de le rafraîchir
                var refreshed = await RefreshTokenAsync();
                if (refreshed)
                {
                    return await GetUserProfileAsync();
                }
                else
                {
                    throw new Exception("Session expirée");
                }
            }
            
            response.EnsureSuccessStatusCode();
            
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserProfile>(responseContent);
        }
        
        public void Logout()
        {
            _tokens = null;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }
        
        // Propriétés pour accéder aux tokens
        public string AccessToken => _tokens?.AccessToken;
        public string RefreshToken => _tokens?.RefreshToken;
        
        // Méthodes pour restaurer une session
        public void SetTokens(string accessToken, string refreshToken)
        {
            _tokens = new AuthTokens
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                TokenType = "bearer"
            };
            
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _tokens.AccessToken);
        }
    }
    
    class Program
    {
        static async Task Main(string[] args)
        {
            var api = new IslamSchoolAPI();
            
            try
            {
                // Connexion
                bool success = await api.LoginAsync("admin", "motdepasse123");
                
                if (success)
                {
                    // Récupération du profil
                    var profile = await api.GetUserProfileAsync();
                    Console.WriteLine($"Connecté en tant que: {profile.Prenom} {profile.Nom}");
                    
                    // Autres opérations...
                }
                else
                {
                    Console.WriteLine("Échec de la connexion");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur: {ex.Message}");
            }
        }
    }
}
```

## Bonnes pratiques de sécurité

### Stockage des tokens

1. **Côté client**:

1. Stockez les tokens dans un endroit sécurisé comme le localStorage, sessionStorage ou un cookie HttpOnly.
2. Pour les applications mobiles, utilisez le stockage sécurisé du système (Keychain pour iOS, KeyStore pour Android).



2. **Côté serveur**:

1. Ne stockez jamais les tokens JWT dans la base de données.
2. Vous pouvez maintenir une liste noire de tokens révoqués si nécessaire.





### Gestion des tokens

1. **Durée de vie**:

1. Le token d'accès a une durée de vie courte (30 minutes par défaut).
2. Le token de rafraîchissement a une durée de vie plus longue (7 jours par défaut).



2. **Rafraîchissement**:

1. Rafraîchissez le token d'accès avant qu'il n'expire pour éviter des interruptions.
2. Si le rafraîchissement échoue, redirigez l'utilisateur vers la page de connexion.



3. **Déconnexion**:

1. Supprimez les tokens du stockage client lors de la déconnexion.





### Sécurité des communications

1. **HTTPS**:

1. Utilisez toujours HTTPS pour toutes les communications avec l'API.
2. Les tokens JWT ne sont pas chiffrés, ils sont seulement signés.



2. **Protection contre les attaques CSRF**:

1. L'utilisation de tokens JWT dans l'en-tête Authorization protège naturellement contre les attaques CSRF.



3. **Protection contre les attaques XSS**:

1. Évitez d'exposer les tokens JWT dans le code JavaScript accessible.
2. Utilisez des cookies HttpOnly lorsque c'est possible.





## Conclusion

Cette documentation vous a fourni les informations nécessaires pour intégrer l'authentification JWT de l'API de l'École Islah dans votre application. Les exemples de code dans différents langages de programmation vous permettent de démarrer rapidement, quelle que soit votre pile technologique.

Pour toute question ou problème, n'hésitez pas à contacter l'équipe de support technique.