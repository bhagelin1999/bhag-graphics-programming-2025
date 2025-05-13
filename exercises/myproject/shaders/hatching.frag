#version 330 core

in vec3 FragWorldPos;
in vec3 FragNormal;
in vec2 AlbedoTexCoord;
in vec2 HatchTexCoord;

out vec4 FragColor;

// Lighting
uniform vec3 AmbientColor;
uniform vec3 LightColor;
uniform vec3 LightPosition;
uniform vec3 CameraPosition;

// Material
uniform vec4 Albedo;
uniform sampler2D AlbedoTexture;

uniform float AmbientReflection;
uniform float DiffuseReflection;
uniform float SpecularReflection;
uniform float SpecularExponent;

// Hatching textures
uniform sampler2D HatchTextures[6];
uniform sampler2DArray HatchTextureArray; // Optional

// --- Lighting Function (Blinn-Phong) ---
vec3 ComputeLighting(vec3 normal, vec3 lightDir, vec3 viewDir)
{
    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotL = max(dot(normal, lightDir), 0.0);
    float NdotH = max(dot(normal, halfVec), 0.0);

    vec3 diffuse = DiffuseReflection * NdotL * vec3(1.0);
    vec3 specular = SpecularReflection * pow(NdotH, SpecularExponent) * vec3(1.0);

    return AmbientReflection * AmbientColor + LightColor * (diffuse + specular);
}

float GetLuminance(vec3 color)
{
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float ComputeHatching(vec3 lighting, vec2 texCoords)
{
    const float levels = 7.0;
    float intensity = clamp(GetLuminance(lighting), 0.0, 1.0) * levels;
    float blend = fract(intensity);

    int idxA = int(floor(intensity));
    int idxB = int(min(idxA + 1, 5));

    float texA = texture(HatchTextures[idxA], texCoords).r;
    float texB = texture(HatchTextures[idxB], texCoords).r;

    return mix(texA, texB, blend);
}

void main()
{
    vec3 normal = normalize(FragNormal);
    vec3 lightDir = normalize(LightPosition - FragWorldPos);
    vec3 viewDir = normalize(CameraPosition - FragWorldPos);


    vec3 lighting = ComputeLighting(normal, lightDir, viewDir);

    vec3 albedoColor = Albedo.rgb;

    float hatch = ComputeHatching(lighting, HatchTexCoord);

    FragColor = vec4(hatch * albedoColor * LightColor, 1.0);
}
