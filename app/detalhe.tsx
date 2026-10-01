import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { deleteSerie, getSerieById, toggleSerieConcluida } from '../src/database/serieRepository';
import { Serie } from '../src/types/serie';

export default function Detalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const serieId = Number(id);

  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  // Recarrega ao focar, para refletir alterações feitas no /form.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      getSerieById(serieId)
        .then((dados) => {
          if (ativo) setSerie(dados);
        })
        .catch((erro) => console.error('Erro ao carregar série:', erro))
        .finally(() => {
          if (ativo) setCarregando(false);
        });
      return () => {
        ativo = false;
      };
    }, [serieId])
  );

  async function alternarConcluida() {
    setOcupado(true);
    try {
      await toggleSerieConcluida(serieId);
      setSerie(await getSerieById(serieId));
    } finally {
      setOcupado(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert('Excluir série', `Deseja excluir "${serie?.titulo}"? Essa ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setOcupado(true);
          try {
            await deleteSerie(serieId);
            router.back();
          } catch {
            setOcupado(false);
            Alert.alert('Erro', 'Não foi possível excluir a série.');
          }
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color="#4f46e5" />
      </View>
    );
  }

  if (!serie) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-gray-500">Série não encontrada.</Text>
      </View>
    );
  }

  const concluida = serie.concluida === 1;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="gap-4 p-4">
      <View
        className={`gap-3 rounded-xl border-l-4 p-4 ${
          concluida ? 'border-green-500 bg-green-50' : 'border-indigo-500 bg-white'
        }`}
      >
        <Text className="text-2xl font-bold text-gray-800">{serie.titulo}</Text>
        <Text
          className={`self-start rounded-full px-3 py-1 text-sm font-semibold ${
            concluida ? 'bg-green-200 text-green-800' : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {concluida ? 'Concluída' : 'Assistindo'}
        </Text>

        <Info rotulo="Plataforma" valor={serie.plataforma} />
        <Info
          rotulo="Temporadas assistidas"
          valor={`${serie.temporadas} ${serie.temporadas === 1 ? 'temporada' : 'temporadas'}`}
        />
        <Info
          rotulo="Nota"
          valor={serie.nota !== null ? `${'★'.repeat(serie.nota)}${'☆'.repeat(5 - serie.nota)} (${serie.nota}/5)` : 'Sem nota'}
        />
        <Info rotulo="Cadastrada em" valor={new Date(serie.createdAt).toLocaleDateString('pt-BR')} />
      </View>

      <TouchableOpacity
        onPress={alternarConcluida}
        disabled={ocupado}
        className={`items-center rounded-xl py-4 ${concluida ? 'bg-indigo-600' : 'bg-green-600'} ${
          ocupado ? 'opacity-50' : ''
        }`}
      >
        <Text className="text-base font-bold text-white">
          {concluida ? 'Voltar para assistindo' : 'Marcar como concluída'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/form?id=${serie.id}`)}
        disabled={ocupado}
        className="items-center rounded-xl border border-indigo-600 bg-white py-4"
      >
        <Text className="text-base font-bold text-indigo-600">Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={confirmarExclusao}
        disabled={ocupado}
        className="items-center rounded-xl border border-red-600 bg-white py-4"
      >
        <Text className="text-base font-bold text-red-600">Excluir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View>
      <Text className="text-xs uppercase text-gray-500">{rotulo}</Text>
      <Text className="text-base text-gray-800">{valor}</Text>
    </View>
  );
}
