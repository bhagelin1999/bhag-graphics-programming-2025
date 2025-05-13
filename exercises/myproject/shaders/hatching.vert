#version 330 core

layout(location = 0) in vec3 VertexPosition;
layout(location = 1) in vec3 VertexNormal;
layout(location = 2) in vec2 VertexTexCoord;

uniform mat4 WorldMatrix;
uniform mat4 ViewProjMatrix;

uniform vec4 AlbedoTexture_ST;
uniform vec4 HatchTexture_ST;

out vec3 FragWorldPos;
out vec3 FragNormal;
out vec2 AlbedoTexCoord;
out vec2 HatchTexCoord;

void main()
{
    vec4 worldPos = WorldMatrix * vec4(VertexPosition, 1.0);
    FragWorldPos = worldPos.xyz;

    FragNormal = mat3(WorldMatrix) * VertexNormal;

    AlbedoTexCoord = VertexTexCoord * AlbedoTexture_ST.xy + AlbedoTexture_ST.zw;
    HatchTexCoord = VertexTexCoord * HatchTexture_ST.xy + HatchTexture_ST.zw;

    gl_Position = ViewProjMatrix * worldPos;
}
