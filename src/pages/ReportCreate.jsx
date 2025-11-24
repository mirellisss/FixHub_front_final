import React, { useState } from 'react';
import FormCard from '../components/FormCard';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ReportCreate() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const locations = ["Térreo", "Primeiro andar"];
  const areas = ["Área externa", "Área interna"];
  const categories = [
    "Área de Embarque/Desembarque",
    "Banheiro Feminino",
    "Banheiro Masculino",
    "Bilheteria",
    "Catraca",
    "Elevador",
    "Escada Rolante",
    "Estacionamento",
    "Praça de Alimentação",
    "Outros"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMensagem("");

  if (!selectedLocation) return setMensagem("⚠️ Selecione o Local.");
  if (!selectedArea) return setMensagem("⚠️ Selecione a Área.");
  if (!selectedCategory) return setMensagem("⚠️ Selecione a Categoria.");
  if (selectedCategory === "Outros" && !otherCategory.trim())
    return setMensagem("⚠️ Descreva a categoria 'Outros'.");
  if (!description.trim())
    return setMensagem("⚠️ A descrição do problema é obrigatória.");

  const categoriaFinal =
    selectedCategory === "Outros" ? otherCategory : selectedCategory;

  const token = localStorage.getItem("authToken");
  if (!token) {
    Swal.fire("Erro", "Usuário não autenticado.", "error");
    return;
  }

  // =============================
  //   CRIANDO O FORM DATA
  // =============================
  const formData = new FormData();
  formData.append("idUsuario", 1);
  formData.append("andar", selectedLocation);
  formData.append("localizacao", categoriaFinal);
  formData.append("descricaoLocalizacao", selectedArea);
  formData.append("descricaoTicketUsuario", description);

  if (image) {
    formData.append("imagem", image);  // <-- AQUI VAI A IMAGEM REAL
  }

  try {
    const response = await fetch(
      "https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗ Não colocar Content-Type aqui!
          // O navegador define automaticamente o boundary do multipart.
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro API:", text);
      throw new Error();
    }

    Swal.fire("Sucesso!", "Report enviado com sucesso!", "success");
    navigate("/reports");

  } catch (err) {
    Swal.fire("Erro", "Não foi possível enviar o report.", "error");
  }
};


  const renderSelect = (label, options, placeholder, value, onChange, disabled) => (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          className="w-full border rounded-xl p-3 bg-white appearance-none shadow-sm 
                     focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
          ▼
        </span>
      </div>
    </div>
  );

  return (
    <div className="py-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">

        {/* HEADER PREMIUM */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 px-6">
          <h2 className="text-xl font-semibold tracking-tight">Criar Report</h2>
          <p className="text-blue-100 text-sm mt-1">Descreva o problema encontrado</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* MENSAGEM */}
          {mensagem && (
            <div className={`p-3 rounded-lg text-center font-medium text-sm
              ${mensagem.startsWith("⚠️")
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-700"}`}>
              {mensagem}
            </div>
          )}

          {/* SELECTS */}
          {renderSelect("Local", locations, "Selecione um local", selectedLocation, setSelectedLocation)}
          {selectedLocation && renderSelect("Área", areas, "Selecione uma área", selectedArea, setSelectedArea)}
          {selectedArea && renderSelect("Categoria", categories, "Selecione uma categoria", selectedCategory, setSelectedCategory)}

          {/* OUTROS */}
          {selectedCategory === "Outros" && (
            <div>
              <label className="font-medium text-sm">Descreva Outros *</label>
              <input
                type="text"
                className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Descreva a categoria"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
              />
            </div>
          )}

          {/* DESCRIÇÃO */}
          <div>
            <label className="font-medium text-sm">Descrição *</label>
            <textarea
              className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Descreva o problema encontrado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* IMAGEM */}
          <div>
            <label className="font-medium text-sm">Adicionar Imagem (opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-600 file:py-2 file:px-4
                         file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-600
                         hover:file:bg-blue-100"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Pré-visualização:</p>
                <img
                  src={preview}
                  className="max-h-48 rounded-xl shadow-lg border border-gray-200 object-cover"
                  alt="preview"
                />
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="reset"
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              onClick={() => {
                setSelectedLocation("");
                setSelectedArea("");
                setSelectedCategory("");
                setOtherCategory("");
                setDescription("");
                setImage(null);
                setPreview(null);
                setMensagem('');
              }}
            >
              Limpar
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Enviar Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
