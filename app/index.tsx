import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getSeries } from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';

const FILTROS: { valor: SerieFilter; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

export default function Home() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  const [series, setSeries] = useState<Serie[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Recarrega ao focar a tela (ex.: voltando do /form) e quando o filtro muda.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      getSeries(filtro)
        .then((dados) => {
          if (ativo) setSeries(dados);
        })
        .catch((erro) => console.error('Erro ao carregar séries:', erro))
        .finally(() => {
          if (ativo) setCarregando(false);
        });
      return () => {
        ativo = false;
      };
    }, [filtro])
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-4 flex-row gap-2">
        {FILTROS.map(({ valor, rotulo }) => {
          const ativo = filtro === valor;
          return (
            <TouchableOpacity
              key={valor}
              onPress={() => setFiltro(valor)}
              className={`flex-1 items-center rounded-full border py-2 ${
                ativo ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-semibold ${ativo ? 'text-white' : 'text-gray-700'}`}>
                {rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-3 pb-4"
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator className="mt-10" color="#4f46e5" />
          ) : (
            <Text className="mt-10 text-center text-gray-500">Nenhuma série encontrada.</Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/detalhe?id=${item.id}`)}>
            <SerieCard serie={item} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push('/form')}
        className="items-center rounded-xl bg-indigo-600 py-4"
      >
        <Text className="text-base font-bold text-white">+ Nova série</Text>
      </TouchableOpacity>
    </View>
  );
}

function SerieCard({ serie }: { serie: Serie }) {
  const concluida = serie.concluida === 1;

  return (
    <View
      className={`rounded-xl border-l-4 p-4 ${
        concluida ? 'border-green-500 bg-green-50' : 'border-indigo-500 bg-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`flex-1 text-lg font-bold ${
            concluida ? 'text-gray-500 line-through' : 'text-gray-800'
          }`}
        >
          {serie.titulo}
        </Text>
        <Text
          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
            concluida ? 'bg-green-200 text-green-800' : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {concluida ? 'Concluída' : 'Assistindo'}
        </Text>
      </View>
      <Text className="mt-1 text-gray-600">{serie.plataforma}</Text>
      <View className="mt-2 flex-row justify-between">
        <Text className="text-gray-600">
          {serie.temporadas} {serie.temporadas === 1 ? 'temporada' : 'temporadas'}
        </Text>
        <Text className="font-semibold text-gray-700">
          {serie.nota !== null ? `Nota: ${serie.nota}/5` : 'Sem nota'}
        </Text>
      </View>
    </View>
  );
}
