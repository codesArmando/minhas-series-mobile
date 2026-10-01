import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createSerie, getSerieById, updateSerie } from '../src/database/serieRepository';

const NOTAS = [1, 2, 3, 4, 5];

export default function Form() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;
  const editando = serieId !== null;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  // Mantido da série carregada; o formulário não altera, mas o UPDATE precisa do valor.
  const [concluida, setConcluida] = useState(0);

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (serieId === null) return;
    let ativo = true;
    getSerieById(serieId)
      .then((serie) => {
        if (!ativo) return;
        if (!serie) {
          setErro('Série não encontrada.');
          return;
        }
        setTitulo(serie.titulo);
        setPlataforma(serie.plataforma);
        setTemporadas(String(serie.temporadas));
        setNota(serie.nota);
        setConcluida(serie.concluida);
      })
      .catch(() => {
        if (ativo) setErro('Erro ao carregar a série.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [serieId]);

  function alternarNota(valor: number) {
    setNota((atual) => (atual === valor ? null : valor));
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasLimpo = temporadas.trim();
    const numTemporadas = Number(temporadasLimpo);

    if (!tituloLimpo) return setErro('Informe o título.');
    if (!plataformaLimpa) return setErro('Informe a plataforma.');
    if (temporadasLimpo === '' || !Number.isInteger(numTemporadas) || numTemporadas < 0) {
      return setErro('Temporadas precisa ser um número inteiro maior ou igual a 0.');
    }

    setErro(null);
    setSalvando(true);
    try {
      const dados = {
        titulo: tituloLimpo,
        plataforma: plataformaLimpa,
        temporadas: numTemporadas,
        nota,
      };
      if (serieId !== null) {
        await updateSerie(serieId, { ...dados, concluida });
      } else {
        await createSerie(dados);
      }
      router.back();
    } catch {
      setErro('Não foi possível salvar a série.');
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color="#4f46e5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />
      <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
        <Campo label="Título">
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex.: Dark"
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
          />
        </Campo>

        <Campo label="Plataforma">
          <TextInput
            value={plataforma}
            onChangeText={setPlataforma}
            placeholder="Ex.: Netflix"
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
          />
        </Campo>

        <Campo label="Temporadas assistidas">
          <TextInput
            value={temporadas}
            onChangeText={setTemporadas}
            placeholder="0"
            keyboardType="numeric"
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
          />
        </Campo>

        <Campo label={nota === null ? 'Nota (sem nota)' : `Nota: ${nota}/5`}>
          <View className="flex-row gap-2">
            {NOTAS.map((valor) => {
              const selecionada = nota !== null && valor <= nota;
              return (
                <TouchableOpacity
                  key={valor}
                  onPress={() => alternarNota(valor)}
                  className={`flex-1 items-center rounded-lg border py-2 ${
                    selecionada ? 'border-amber-400 bg-amber-100' : 'border-gray-300 bg-white'
                  }`}
                >
                  <Text className={`text-xl ${selecionada ? 'text-amber-500' : 'text-gray-300'}`}>
                    ★
                  </Text>
                  <Text className="text-xs text-gray-600">{valor}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Campo>

        {erro && <Text className="text-center font-semibold text-red-600">{erro}</Text>}

        <TouchableOpacity
          onPress={salvar}
          disabled={salvando}
          className={`items-center rounded-xl py-4 ${salvando ? 'bg-indigo-300' : 'bg-indigo-600'}`}
        >
          <Text className="text-base font-bold text-white">
            {salvando ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-1">
      <Text className="font-semibold text-gray-700">{label}</Text>
      {children}
    </View>
  );
}
